import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('cloud snapshot bridge contains required production fields',async()=>{
  const source=await readFile(new URL('../cloud/snapshot.js',import.meta.url),'utf8');
  assert.match(source,/schemaVersion:1/);
  assert.match(source,/deviceId:deviceId\(\)/);
  assert.match(source,/updatedAt:now/);
  assert.match(source,/FitnessCoachCloudSnapshot/);
});
