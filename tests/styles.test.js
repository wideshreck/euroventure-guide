import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((value) => Number.parseInt(value, 16) / 255);
  const [red, green, blue] = channels.map((value) => (
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ));
  return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('styles include tokens, responsive rules, focus, and reduced motion', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  for (const value of ['--ink:', '--lime:', ':focus-visible', '@media (max-width: 719px)', 'prefers-reduced-motion']) {
    assert.ok(css.includes(value), `missing ${value}`);
  }
});

test('directory content cap remains fluid below desktop', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const fixedColumnLedger = /grid-template-columns:[^;]*repeat\(12[^;]*var\(--content-width\)[^;]*\/\s*12/;

  assert.doesNotMatch(css, fixedColumnLedger, 'fixed 1240px columns overflow tablet widths');
});

test('secondary text token maintains small-text contrast on cloud', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const token = (name) => css.match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];

  assert.ok(contrast(token('--ink-muted'), token('--cloud')) >= 4.5);
});
