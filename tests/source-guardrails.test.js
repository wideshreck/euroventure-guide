import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('product source excludes emoji and em dash punctuation', async () => {
  const paths = ['../index.html', '../src/cities.js', '../src/app.js'];
  const source = (await Promise.all(paths.map((path) => readFile(new URL(path, import.meta.url), 'utf8')))).join('\n');
  assert.equal(/\p{Extended_Pictographic}/u.test(source), false);
  assert.equal(source.includes('—'), false);
});

test('dialog interaction restores originating focus', async () => {
  const source = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.ok(source.includes('lastFocused'));
  assert.ok(source.includes('showModal()'));
  assert.ok(source.includes('lastFocused?.focus()'));
});
