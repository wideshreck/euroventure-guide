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

test('focus treatment exposes a contrasting edge on ink and cloud', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const token = (name) => css.match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];
  const focusRule = css.match(/:focus-visible\s*\{([^}]*)\}/)?.[1] ?? '';

  assert.match(focusRule, /outline:[^;]*var\(--lime\)/);
  assert.match(focusRule, /box-shadow:[^;]*var\(--ink\)/);
  assert.ok(contrast(token('--lime'), token('--ink')) >= 3);
  assert.ok(contrast(token('--ink'), token('--cloud')) >= 3);
});

test('essential metadata is permitted to wrap without clipping', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const metadataRule = css.match(/\.city-card__meta dd,\s*\.city-detail__meta dd\s*\{([^}]*)\}/)?.[1] ?? '';

  assert.match(metadataRule, /white-space:\s*normal/);
  assert.match(metadataRule, /overflow-wrap:\s*(?:break-word|anywhere)/);
  assert.doesNotMatch(metadataRule, /overflow:\s*hidden|text-overflow:\s*ellipsis|white-space:\s*nowrap/);
});

test('mobile dialog title stays bounded and can wrap safely', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const titleRules = [...css.matchAll(/\.city-detail__header h2\s*\{([^}]*)\}/g)];
  const mobileRule = titleRules.at(-1)?.[1] ?? '';
  const fluidSize = mobileRule.match(/font-size:\s*clamp\(([\d.]+)rem,\s*([\d.]+)vw,\s*([\d.]+)rem\)/);

  assert.ok(fluidSize, 'missing bounded mobile title size');
  const [, minimumRem, fluidVw, maximumRem] = fluidSize;
  const sizeAt375 = Math.min(Number(maximumRem) * 16, Math.max(Number(minimumRem) * 16, Number(fluidVw) * 3.75));
  assert.ok(sizeAt375 <= 60, `mobile title is ${sizeAt375}px at 375px`);
  assert.match(mobileRule, /max-width:\s*100%/);
  assert.match(mobileRule, /overflow-wrap:\s*anywhere/);
});

test('wordmark meets the minimum touch target', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const wordmarkRule = css.match(/\.wordmark\s*\{([^}]*)\}/)?.[1] ?? '';

  assert.match(wordmarkRule, /display:\s*inline-flex/);
  assert.match(wordmarkRule, /align-items:\s*center/);
  assert.match(wordmarkRule, /min-height:\s*2\.75rem/);
});

test('empty-state icon styles match the generated wrapper', async () => {
  const [css, html] = await Promise.all([
    readFile(new URL('../styles.css', import.meta.url), 'utf8'),
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
  ]);

  assert.match(html, /<span data-icon="map-pin"><\/span>/);
  assert.match(css, /\.empty-state > \[data-icon\]\s*\{/);
  assert.match(css, /\.empty-state > \[data-icon\] svg\s*\{/);
});
