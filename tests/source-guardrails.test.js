import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('product source excludes emoji and em dash punctuation', async () => {
  const paths = [
    '../index.html',
    '../styles.css',
    '../src/cities.js',
    '../src/explore.js',
    '../src/icons.js',
    '../src/app.js',
  ];
  const source = (await Promise.all(paths.map((path) => readFile(new URL(path, import.meta.url), 'utf8')))).join('\n');
  assert.equal(/\p{Extended_Pictographic}/u.test(source), false);
  assert.equal(source.includes('—'), false);
});

test('dialog lifecycle moves focus to close control and restores the origin', async () => {
  const source = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');

  assert.match(source, /let lastFocused;/);
  assert.match(source, /dialog\.addEventListener\('close', \(\) => \{\s*lastFocused\?\.focus\(\);\s*lastFocused = null;/);
  assert.match(source, /dialog\.addEventListener\('cancel', \(event\) => \{\s*event\.preventDefault\(\);\s*dialog\.close\(\);/);
  assert.match(source, /if \(event\.target === dialog\) dialog\.close\(\);/);
  assert.match(source, /dialog\.showModal\(\);\s*closeButton\?\.focus\(\);/);
});

test('random city restores focus to its trigger and honors reduced motion', async () => {
  const source = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');

  assert.match(source, /const reducedMotion = window\.matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.matches;/);
  assert.match(source, /card\?\.scrollIntoView\(\{ behavior: reducedMotion \? 'auto' : 'smooth', block: 'center' \}\);/);
  assert.match(source, /openCity\(city, randomCity\);/);
  assert.doesNotMatch(source, /card\?\.querySelector\('\[data-open-city\]'\)/);
});

test('search form prevents native submission from resetting discovery state', async () => {
  const source = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');

  assert.match(source, /const searchForm = document\.querySelector\('\.search-form'\);/);
  assert.match(source, /searchForm\.addEventListener\('submit', \(event\) => \{\s*event\.preventDefault\(\);\s*\}\);/);
});
