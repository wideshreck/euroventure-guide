import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('document declares an embedded favicon', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

  assert.match(html, /<link rel="icon" href="data:image\/svg\+xml,/);
});

test('page exposes the required landmarks and controls', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const value of ['<header', '<main', '<footer', 'id="search-input"', 'id="city-grid"', '<dialog', 'id="dialog-title"']) {
    assert.ok(html.includes(value), `missing ${value}`);
  }
});

test('only the compact result count announces directory updates', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const resultCount = html.match(/<p id="result-count"[^>]*>/)?.[0] ?? '';
  const cityGrid = html.match(/<div id="city-grid"[^>]*>/)?.[0] ?? '';

  assert.match(resultCount, /aria-live="polite"/);
  assert.doesNotMatch(cityGrid, /aria-live/);
});

test('icon renders every allowed name with the accessible SVG contract', async () => {
  const { icon } = await import('../src/icons.js');
  const names = [
    'search',
    'arrow-down',
    'arrow-up-right',
    'map-pin',
    'clock',
    'wallet',
    'calendar',
    'landmark',
    'utensils',
    'sparkles',
    'hotel',
    'train-front',
    'triangle-alert',
    'x',
  ];

  for (const name of names) {
    const svg = icon(name, 20);
    assert.ok(svg.startsWith('<svg'), `${name} did not render an SVG`);
    assert.match(svg, /width="20" height="20"/);
    assert.match(svg, /stroke="currentColor"/);
    assert.match(svg, /fill="none"/);
    assert.match(svg, /stroke-width="1\.75"/);
    assert.match(svg, /aria-hidden="true"/);
  }
});

test('cityCardMarkup renders semantic city data and escapes inserted text', async () => {
  const { cityCardMarkup } = await import('../src/app.js');
  const city = {
    slug: 'test-city',
    name: 'A&B <script>',
    country: 'Test Ülkesi',
    summary: '<strong>Güvenli özet</strong>',
    duration: '3 gün',
    budget: 'Orta',
    season: 'Bahar',
    image: 'https://example.com/city.jpg?x=1&y=2',
    imageAlt: 'Test şehri <görünümü>',
    highlights: {
      see: ['Müze'],
      eat: ['Yerel yemek'],
      do: ['Yürüyüş'],
    },
  };

  const html = cityCardMarkup(city);

  assert.ok(html.includes('<article'));
  assert.ok(html.includes('A&amp;B &lt;script&gt;'));
  assert.ok(html.includes('&lt;strong&gt;Güvenli özet&lt;/strong&gt;'));
  assert.equal(html.includes('<script>'), false);
  assert.ok(html.includes('Test Ülkesi'));
  assert.ok(html.includes('3 gün'));
  assert.ok(html.includes('Orta'));
  assert.ok(html.includes('Bahar'));
  assert.ok(html.includes('Görülecekler'));
  assert.ok(html.includes('Yenecekler'));
  assert.ok(html.includes('Yapılacaklar'));
  assert.ok(html.includes('Rehberi aç: A&amp;B &lt;script&gt;'));
});

test('renderCities integrates the complete ten-city catalog into the grid', async () => {
  const [{ renderCities }, { cities }] = await Promise.all([
    import('../src/app.js'),
    import('../src/cities.js'),
  ]);
  const cityGrid = { innerHTML: '' };
  const expectedSlugs = [
    'istanbul',
    'londra',
    'berlin',
    'madrid',
    'viyana',
    'budapeste',
    'roma',
    'paris',
    'barselona',
    'amsterdam',
  ];

  renderCities(cities, cityGrid);

  assert.equal((cityGrid.innerHTML.match(/<article/g) ?? []).length, 10);
  for (const slug of expectedSlugs) {
    assert.ok(cityGrid.innerHTML.includes(`id="city-${slug}"`), `missing ${slug} card`);
  }
});

test('cityDialogMarkup renders the complete practical guide for a city', async () => {
  const [{ cityDialogMarkup }, { cities }] = await Promise.all([
    import('../src/app.js'),
    import('../src/cities.js'),
  ]);

  const html = cityDialogMarkup(cities[0]);

  assert.ok(html.includes('id="dialog-title"'));
  assert.ok(html.includes('İstanbul'));
  assert.ok(html.includes('Ayasofya, Sultanahmet ve Topkapı'));
  assert.ok(html.includes('Eminönü balık ekmek'));
  assert.ok(html.includes('Gün batımında Şehir Hatları vapuru'));
  assert.ok(html.includes('Nerede kalınır'));
  assert.ok(html.includes('Ulaşım'));
  assert.ok(html.includes('Pratik notlar'));
  assert.ok(html.includes('data-close-dialog'));
});

test('bindCityCardActions populates and opens the dialog after cards render', async () => {
  const { bindCityCardActions } = await import('../src/app.js');
  const buttonEvents = {};
  const closeEvents = {};
  const button = {
    dataset: { openCity: 'istanbul' },
    addEventListener(type, handler) {
      buttonEvents[type] = handler;
    },
  };
  const closeButton = {
    addEventListener(type, handler) {
      closeEvents[type] = handler;
    },
  };
  const cityGrid = {
    querySelectorAll() {
      return [button];
    },
  };
  const dialogContent = {
    innerHTML: '',
    querySelector() {
      return closeButton;
    },
  };
  const dialog = {
    opened: false,
    closed: false,
    showModal() {
      this.opened = true;
    },
    close() {
      this.closed = true;
    },
  };

  bindCityCardActions(cityGrid, dialog, dialogContent);
  buttonEvents.click();

  assert.ok(dialogContent.innerHTML.includes('İstanbul'));
  assert.equal(dialog.opened, true);

  closeEvents.click();
  assert.equal(dialog.closed, true);
});
