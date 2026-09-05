import test from 'node:test';
import assert from 'node:assert/strict';
import { cities } from '../src/cities.js';
import { filterCities, normalizeTurkish } from '../src/explore.js';

test('contains the complete ten-city guide', () => {
  assert.equal(cities.length, 10);
  assert.equal(new Set(cities.map(({ slug }) => slug)).size, 10);
});

test('normalizes Turkish search text', () => {
  assert.equal(normalizeTurkish('İSTANBUL'), 'istanbul');
});

test('combines query and route filter', () => {
  const result = filterCities(cities, 'ispanya', 'warm');
  assert.deepEqual(result.map(({ slug }) => slug), ['madrid', 'barselona']);
});
