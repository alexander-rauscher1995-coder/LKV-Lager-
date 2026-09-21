import {createPublicKey, verify as verifySignature} from 'node:crypto';
import persistence from './persistence.js';

function auth(req){
  const h=req.headers.authorization||'';
  if(!h.startsWith('Bearer '))return null;
  const token=h.slice(7).trim();
  return token?{token}:null;
}

function json(res,status,payload){return res.status(status).json(payload)}

function base64urlJson(part){
  try{return JSON.parse(Buffer.from(part,'base64url').toString('utf8'))}catch{return null}
}

function verifyJwt(token){
  const parts=token.split('.');
  if(parts.length!==3)return {ok:false,reason:'malformed'};
  const [encodedHeader,encodedPayload,encodedSignature]=parts;
  const header=base64urlJson(encodedHeader);
  const payload=base64urlJson(encodedPayload);
  if(!header||!payload||header.alg!=='RS256')return {ok:false,reason:'unsupported_token'};
  if(typeof payload.sub!=='string'||!payload.sub)return {ok:false,reason:'missing_subject'};

  const issuer=process.env.FITNESS_AUTH_ISSUER;
  const audience=process.env.FITNESS_AUTH_AUDIENCE;
  const pem=process.env.FITNESS_JWT_PUBLIC_KEY;
  if(!issuer||!audience||!pem)return {ok:false,reason:'auth_not_configured'};

  const now=Math.floor(Date.now()/1000);
  if(typeof payload.exp!=='number'||payload.exp<=now)return {ok:false,reason:'expired'};
  if(typeof payload.nbf==='number'&&payload.nbf>now+30)return {ok:false,reason:'not_active'};
  if(payload.iss!==issuer)return {ok:false,reason:'issuer_mismatch'};
  const aud=Array.isArray(payload.aud)?payload.aud:[payload.aud];
  if(!aud.includes(audience))return {ok:false,reason:'audience_mismatch'};

  try{
    const key=createPublicKey(pem);
    const signingInput=Buffer.from(encodedHeader+'.'+encodedPayload);
    const signature=Buffer.from(encodedSignature,'base64url');
    const valid=verifySignature('RSA-SHA256',signingInput,key,signature);
    return valid?{ok:true,subject:payload.sub,payload}:{ok:false,reason:'invalid_signature'};
  }catch{return {ok:false,reason:'invalid_key'}}
}

export function requireAuth(req,res){
  const a=auth(req);
  if(!a){json(res,401,{error:'unauthorized'});return null}
  const result=verifyJwt(a.token);
  if(!result.ok){
    const status=result.reason==='auth_not_configured'?503:401;
    json(res,status,{error:status===503?'auth_not_configured':'unauthorized'});
    return null;
  }
  return {token:a.token,subject:result.subject,claims:result.payload};
}

export function validateSnapshot(x){
  if(!x||typeof x!=='object'||Array.isArray(x))return false;
  if(x.schemaVersion!==1||typeof x.deviceId!=='string'||x.deviceId.length<8||x.deviceId.length>200||typeof x.updatedAt!=='string'||typeof x.data!=='object'||!x.data||Array.isArray(x.data))return false;
  if(!Number.isFinite(Date.parse(x.updatedAt)))return false;
  return JSON.stringify(x).length<=1000000;
}

/*
 * Production persistence adapter.
 * The API intentionally does not guess a database provider. Deployments must
 * supply these four operations using their private database credentials.
 * The adapter is never exposed to the browser.
 */
export function getPersistence(){
  const adapter=globalThis.FITNESS_PERSISTENCE;
  if(adapter&&typeof adapter.getSnapshot==='function'&&typeof adapter.putSnapshot==='function'&&typeof adapter.appendChanges==='function'){
    return adapter;
  }
  if(process.env.FITNESS_DATABASE_URL)return persistence;
  return null;
}

export async function readUserSnapshot(subject){
  const adapter=getPersistence();
  return adapter?adapter.getSnapshot(subject):null;
}

export async function writeUserSnapshot(subject,snapshot){
  const adapter=getPersistence();
  return adapter?adapter.putSnapshot(subject,snapshot):null;
}

export async function writeUserChanges(subject,changes){
  const adapter=getPersistence();
  return adapter?adapter.appendChanges(subject,changes):null;
}

export {json};
