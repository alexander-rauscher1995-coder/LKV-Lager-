import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const files = ['index.html','calculator-pro.js','training-pro.js','nutrition-pro.js','progress-pro.js','cloud/runtime-config.js'];

test('core app files exist and are non-empty', () => {
  for (const file of files) {
    assert.ok(fs.existsSync(file), file + ' missing');
    assert.ok(fs.statSync(file).size > 100, file + ' is unexpectedly small');
  }
});

test('runtime config loads all Pro layers', () => {
  const runtime = fs.readFileSync('cloud/runtime-config.js','utf8');
  for (const layer of ['calculator-pro.js?v=165','training-pro.js?v=1','nutrition-pro.js?v=1','progress-pro.js?v=1']) {
    assert.ok(runtime.includes(layer), layer + ' not loaded');
  }
});

test('calculator exposes safe target calculation', () => {
  const html = fs.readFileSync('index.html','utf8');
  assert.match(html, /function calcTarget\(\)/);
  assert.match(html, /Number\(calorieState\.age\)<18/);
  assert.match(html, /function calcBreakdown\(\)/);
});

test('Progress Pro exposes refresh and analytics', () => {
  const code = fs.readFileSync('progress-pro.js','utf8');
  assert.match(code, /progressProRefresh/);
  assert.match(code, /current7/);
  assert.match(code, /previous7/);
  assert.match(code, /prs/);
});
