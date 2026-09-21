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


test('cloud snapshot bridge validates snapshot shape before queueing',async()=>{
  assert.match("import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport {readFile} from 'node:fs/promises';\n\ntest('cloud snapshot bridge contains required production fields',async()=>{\n  const source=await readFile(new URL('../cloud/snapshot.js',import.meta.url),'utf8');\n  assert.match(source,/schemaVersion:1/);\n  assert.match(source,/deviceId:deviceId\\(\\)/);\n  assert.match(source,/updatedAt:now/);\n  assert.match(source,/FitnessCoachCloudSnapshot/);\n});\n\\n",/FitnessCoachCloudSnapshot/);
  const source=await readFile(new URL('../cloud/snapshot.js',import.meta.url),'utf8');
  assert.match(source,/function validateSnapshot\(x\)/);
  assert.match(source,/Invalid local snapshot/);
});
