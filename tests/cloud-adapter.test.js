import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

async function loadAdapter(fetchImpl){
  const source=await readFile(new URL('../cloud/sync-adapter.js',import.meta.url),'utf8');
  const store=new Map();
  const listeners={};
  const window={
    FITNESS_CLOUD_CONFIG:{
      enabled:true,
      apiBaseUrl:'https://api.example.test',
      getToken:async()=> 'test-token'
    },
    addEventListener:(name,fn)=>{listeners[name]=fn},
    dispatchEvent:()=>true,
    localStorage:{
      getItem:k=>store.has(k)?store.get(k):null,
      setItem:(k,v)=>store.set(k,String(v))
    },
    crypto:{randomUUID:()=> 'device-test-1234'}
  };
  const context={
    window,
    localStorage:window.localStorage,
    crypto:window.crypto,
    navigator:{onLine:true},
    CustomEvent:class CustomEvent{constructor(type){this.type=type}},
    fetch:fetchImpl
  };
  vm.runInNewContext(source,context);
  return {window,store,listeners};
}

test('queues failed cloud snapshots and flushes them later',async()=>{
  let online=false;
  const calls=[];
  const {window,store}=await loadAdapter(async(_url,options)=>{
    calls.push(JSON.parse(options.body));
    if(!online)throw new Error('offline');
    return {ok:true,status:200,json:async()=>({revision:1})};
  });

  const first=await window.FitnessCloud.syncSnapshot({schemaVersion:1,deviceId:'device-test-1234',updatedAt:new Date().toISOString(),data:{weight:80}});
  assert.equal(first.status,'queued');
  assert.equal(window.FitnessCloud.queue().length,1);

  online=true;
  const flushed=await window.FitnessCloud.flushQueue();
  assert.equal(flushed.sent,1);
  assert.equal(flushed.pending,0);
  assert.equal(window.FitnessCloud.status().revision,1);
  assert.equal(calls[0].baseRevision,0);
  assert.equal(calls[0].data.weight,80);
  assert.equal(store.get('fitness_cloud_revision_v1'),'1');
});

test('keeps only the newest pending snapshot for one device',async()=>{
  const {window}=await loadAdapter(async()=>{throw new Error('offline')});
  const now=new Date().toISOString();
  await window.FitnessCloud.syncSnapshot({schemaVersion:1,deviceId:'device-test-1234',updatedAt:now,data:{weight:80}});
  await window.FitnessCloud.syncSnapshot({schemaVersion:1,deviceId:'device-test-1234',updatedAt:now,data:{weight:79}});
  const q=window.FitnessCloud.queue();
  assert.equal(q.length,1);
  assert.equal(q[0].payload.data.weight,79);
});
