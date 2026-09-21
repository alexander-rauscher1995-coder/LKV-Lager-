import test from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPairSync,createSign} from 'node:crypto';
import {validateSnapshot} from '../api/_lib/sync.js';
import syncHandler from '../api/v1/sync.js';
import changesHandler from '../api/v1/sync/changes.js';

const {privateKey,publicKey}=generateKeyPairSync('rsa',{modulusLength:2048});
process.env.FITNESS_AUTH_ISSUER='fitness-test';
process.env.FITNESS_AUTH_AUDIENCE='fitness-api';
process.env.FITNESS_JWT_PUBLIC_KEY=publicKey.export({type:'spki',format:'pem'});

const db=new Map();

function token(subject){
  const b64=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
  const h=b64({alg:'RS256',typ:'JWT'});
  const p=b64({sub:subject,iss:'fitness-test',aud:'fitness-api',exp:Math.floor(Date.now()/1000)+300});
  const s=createSign('RSA-SHA256'); s.update(h+'.'+p); s.end();
  return h+'.'+p+'.'+s.sign(privateKey).toString('base64url');
}

globalThis.FITNESS_PERSISTENCE={
  async getSnapshot(userId){return db.get(userId)||null;},
  async putSnapshot(userId,snapshot){
    const previous=db.get(userId);
    const currentRevision=previous?.revision||0;
    const base=Number(snapshot.baseRevision||0);
    if(previous&&base!==currentRevision){
      return {revision:currentRevision,conflicts:[{type:'revision-conflict',expected:base,actual:currentRevision}]};
    }
    const revision=currentRevision+1;
    db.set(userId,{revision,snapshot:{...snapshot,revision}});
    return {revision,conflicts:[]};
  },
  async appendChanges(userId,changes){
    const previous=db.get(userId);
    const revision=(previous?.revision||0)+1;
    db.set(userId,{revision,snapshot:previous?.snapshot||null,changes});
    return {revision,conflicts:[]};
  }
};

function response(){
  return {
    statusCode:200,
    payload:null,
    status(code){this.statusCode=code;return this;},
    json(payload){this.payload=payload;return this;}
  };
}
function req(method,subject,body){
  return {method,body,headers:{authorization:'Bearer '+token(subject)}};
}
function snapshot(deviceId='device-test-1234'){
  return {schemaVersion:1,deviceId,updatedAt:new Date().toISOString(),data:{weight:80}};
}

test('validates production snapshot contract',()=>{
  assert.equal(validateSnapshot(snapshot()),true);
  assert.equal(validateSnapshot({...snapshot(),deviceId:'x'}),false);
  assert.equal(validateSnapshot({...snapshot(),schemaVersion:2}),false);
});

test('rejects invalid signatures',async()=>{
  const res=response();
  await syncHandler({method:'GET',headers:{authorization:'Bearer eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyLWEiLCJpc3MiOiJmaXRuZXNzLXRlc3QiLCJhdWQiOiJmaXRuZXNzLWFwaSIsImV4cCI6OTk5OTk5OTk5OX0.invalid'}},res);
  assert.equal(res.statusCode,401);
});

test('rejects unauthenticated sync requests',async()=>{
  const res=response();
  await syncHandler({method:'GET',headers:{}},res);
  assert.equal(res.statusCode,401);
  assert.equal(res.payload.error,'unauthorized');
});

test('isolates snapshots by authenticated user',async()=>{
  db.clear();
  let res=response();
  await syncHandler(req('PUT','user-a',snapshot('device-a')),res);
  assert.equal(res.statusCode,200);

  res=response();
  await syncHandler(req('GET','user-b'),res);
  assert.equal(res.statusCode,200);
  assert.equal(res.payload.snapshot,null);

  res=response();
  await syncHandler(req('GET','user-a'),res);
  assert.equal(res.payload.snapshot.data.weight,80);
});

test('increments revision and reports conflict metadata',async()=>{
  db.clear();
  let res=response();
  await syncHandler(req('PUT','conflict-user',snapshot('device-a')),res);
  assert.equal(res.payload.revision,1);

  res=response();
  await syncHandler(req('PUT','conflict-user',{...snapshot('device-b'),baseRevision:0}),res);
  assert.equal(res.statusCode,409);
  assert.equal(res.payload.revision,1);
  assert.equal(Array.isArray(res.payload.conflicts),true);
});

test('supports restore by writing then reading the same snapshot',async()=>{
  db.clear();
  const restored={...snapshot('restore-device'),data:{weight:78,waist:82}};
  let res=response();
  await syncHandler(req('PUT','restore-user',restored),res);
  assert.equal(res.statusCode,200);

  res=response();
  await syncHandler(req('GET','restore-user'),res);
  assert.deepEqual(res.payload.snapshot.data,restored.data);
});

test('accepts bounded change batches and rejects oversized batches',async()=>{
  db.clear();
  let res=response();
  await changesHandler(req('POST','changes-user',{changes:Array.from({length:500},(_,i)=>({id:i}))}),res);
  assert.equal(res.statusCode,200);

  res=response();
  await changesHandler(req('POST','changes-user',{changes:Array.from({length:501},(_,i)=>({id:i}))}),res);
  assert.equal(res.statusCode,400);
  assert.equal(res.payload.error,'invalid_changes');
});
