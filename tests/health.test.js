import test from 'node:test';
import assert from 'node:assert/strict';
import healthHandler from '../api/health.js';

function response(){
  return {
    statusCode:200,
    payload:null,
    status(code){this.statusCode=code;return this;},
    json(payload){this.payload=payload;return this;}
  };
}

const ENV_KEYS=[
  'FITNESS_DATABASE_URL',
  'FITNESS_AUTH_ISSUER',
  'FITNESS_AUTH_AUDIENCE',
  'FITNESS_JWT_PUBLIC_KEY'
];

test('health reports backend readiness only when all production settings exist',async()=>{
  const previous=Object.fromEntries(ENV_KEYS.map(k=>[k,process.env[k]]));
  try{
    ENV_KEYS.forEach(k=>delete process.env[k]);
    let res=response();
    await healthHandler({},res);
    assert.equal(res.statusCode,200);
    assert.equal(res.payload.ready,false);
    assert.equal(res.payload.backendConfigured,false);
    assert.equal(res.payload.authConfigured,false);

    process.env.FITNESS_DATABASE_URL='postgresql://test';
    process.env.FITNESS_AUTH_ISSUER='issuer';
    process.env.FITNESS_AUTH_AUDIENCE='audience';
    process.env.FITNESS_JWT_PUBLIC_KEY='public-key';

    res=response();
    await healthHandler({},res);
    assert.equal(res.payload.ready,true);
    assert.equal(res.payload.backendConfigured,true);
    assert.equal(res.payload.authConfigured,true);
    assert.deepEqual(res.payload.requiredEnvironment,{
      databaseUrl:true,
      authIssuer:true,
      authAudience:true,
      jwtPublicKey:true
    });
  }finally{
    ENV_KEYS.forEach(k=>{
      if(previous[k]===undefined)delete process.env[k];
      else process.env[k]=previous[k];
    });
  }
});
