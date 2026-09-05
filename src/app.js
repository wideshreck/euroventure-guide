import { cities } from './cities.js';
import { filterCities } from './explore.js';
import { icon } from './icons.js';

const escapeCharacters = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => escapeCharacters[character]);
}

function highlightMarkup(label, iconName, items) {
  const listItems = items
    .slice(0, 2)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  return `
    <section class="city-card__highlight">
      <h4>${icon(iconName, 16)}<span>${label}</span></h4>
      <ul>${listItems}</ul>
    </section>`;
}

export function cityCardMarkup(city) {
  const name = escapeHtml(city.name);
  const slug = escapeHtml(city.slug);

  return `
    <article class="city-card" id="city-${slug}" data-city="${slug}">
      <figure class="city-card__media">
        <img src="${escapeHtml(city.image)}" alt="${escapeHtml(city.imageAlt)}" width="1000" height="680" loading="lazy">
      </figure>
      <div class="city-card__body">
        <header class="city-card__header">
          <div>
            <p class="city-card__country">${icon('map-pin', 16)}<span>${escapeHtml(city.country)}</span></p>
            <h3>${name}</h3>
          </div>
          <button class="city-card__action" type="button" data-open-city="${slug}" aria-label="Rehberi aç: ${name}">
            <span>Rehberi aç</span>${icon('arrow-up-right', 18)}
          </button>
        </header>
        <p class="city-card__summary">${escapeHtml(city.summary)}</p>
        <dl class="city-card__meta">
          <div>
            <dt>${icon('clock', 16)}<span>Süre</span></dt>
            <dd>${escapeHtml(city.duration)}</dd>
          </div>
          <div>
            <dt>${icon('wallet', 16)}<span>Bütçe</span></dt>
            <dd>${escapeHtml(city.budget)}</dd>
          </div>
          <div>
            <dt>${icon('calendar', 16)}<span>Mevsim</span></dt>
            <dd>${escapeHtml(city.season)}</dd>
          </div>
        </dl>
        <div class="city-card__highlights">
          ${highlightMarkup('Görülecekler', 'landmark', city.highlights.see)}
          ${highlightMarkup('Yenecekler', 'utensils', city.highlights.eat)}
          ${highlightMarkup('Yapılacaklar', 'sparkles', city.highlights.do)}
        </div>
      </div>
    </article>`;
}

function detailListMarkup(title, iconName, items, className = '') {
  const listItems = items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  return `
    <section class="city-detail__section ${className}">
      <h3>${icon(iconName, 18)}<span>${title}</span></h3>
      <ul>${listItems}</ul>
    </section>`;
}

export function cityDialogMarkup(city) {
  return `
    <article class="city-detail">
      <button class="city-detail__close" type="button" data-close-dialog aria-label="Şehir rehberini kapat">
        ${icon('x', 22)}
      </button>
      <figure class="city-detail__media">
        <img src="${escapeHtml(city.image)}" alt="${escapeHtml(city.imageAlt)}" width="1000" height="680">
        <figcaption>${escapeHtml(city.caption)}</figcaption>
      </figure>
      <div class="city-detail__body">
        <header class="city-detail__header">
          <p class="city-detail__country">${icon('map-pin', 16)}<span>${escapeHtml(city.country)}</span></p>
          <h2 id="dialog-title">${escapeHtml(city.name)}</h2>
          <p class="city-detail__mood">${escapeHtml(city.mood)}</p>
          <p>${escapeHtml(city.summary)}</p>
          <dl class="city-detail__meta">
            <div><dt>${icon('clock', 16)}<span>Süre</span></dt><dd>${escapeHtml(city.duration)}</dd></div>
            <div><dt>${icon('wallet', 16)}<span>Bütçe</span></dt><dd>${escapeHtml(city.budget)}</dd></div>
            <div><dt>${icon('calendar', 16)}<span>Mevsim</span></dt><dd>${escapeHtml(city.season)}</dd></div>
          </dl>
        </header>
        <div class="city-detail__highlights">
          ${detailListMarkup('Görülecekler', 'landmark', city.highlights.see)}
          ${detailListMarkup('Yenecekler', 'utensils', city.highlights.eat)}
          ${detailListMarkup('Yapılacaklar', 'sparkles', city.highlights.do)}
        </div>
        <div class="city-detail__practical">
          ${detailListMarkup('Nerede kalınır', 'hotel', city.stays)}
          ${detailListMarkup('Ulaşım', 'train-front', city.transport)}
          ${detailListMarkup('Pratik notlar', 'triangle-alert', city.notes, 'city-detail__section--notes')}
        </div>
      </div>
    </article>`;
}

function decorateIcons(root) {
  root.querySelectorAll('[data-icon]').forEach((element) => {
    element.innerHTML = icon(element.dataset.icon, 18);
  });
}

export function renderCities(items, cityGrid) {
  cityGrid.innerHTML = items.map(cityCardMarkup).join('');
}

export function bindCityCardActions(cityGrid, dialog, dialogContent, catalog = cities, openCity = null) {
  cityGrid.querySelectorAll('[data-open-city]').forEach((button) => {
    button.addEventListener('click', () => {
      const city = catalog.find((item) => item.slug === button.dataset.openCity);
      if (!city) return;

      if (openCity) {
        openCity(city, button);
        return;
      }

      dialogContent.innerHTML = cityDialogMarkup(city);
      dialogContent.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close());
      dialog.showModal();
    });
  });
}

function createCityDialogController(dialog, dialogContent) {
  let lastFocused;

  dialog.addEventListener('close', () => {
    lastFocused?.focus();
    lastFocused = null;
  });

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    dialog.close();
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  return (city, origin) => {
    lastFocused = origin;
    dialogContent.innerHTML = cityDialogMarkup(city);

    const closeButton = dialogContent.querySelector('[data-close-dialog]');
    closeButton?.addEventListener('click', () => dialog.close());
    dialog.showModal();
    closeButton?.focus();
  };
}

function initialize() {
  const cityGrid = document.querySelector('#city-grid');
  const dialog = document.querySelector('#city-dialog');
  const dialogContent = document.querySelector('#dialog-content');
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('#search-input');
  const filterList = document.querySelector('#filter-list');
  const resultCount = document.querySelector('#result-count');
  const emptyState = document.querySelector('#empty-state');
  const resetSearch = document.querySelector('#reset-search');
  const randomCity = document.querySelector('#random-city');
  if (!cityGrid || !dialog || !dialogContent || !searchForm || !searchInput || !filterList || !resultCount || !emptyState || !resetSearch || !randomCity) return;

  let activeFilter = 'all';
  let visibleCities = cities;
  const openCity = createCityDialogController(dialog, dialogContent);

  function updateDirectory() {
    visibleCities = filterCities(cities, searchInput.value, activeFilter);
    renderCities(visibleCities, cityGrid);
    bindCityCardActions(cityGrid, dialog, dialogContent, cities, openCity);

    filterList.querySelectorAll('[data-filter]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter));
    });

    resultCount.textContent = `${visibleCities.length} şehir gösteriliyor`;
    emptyState.hidden = visibleCities.length !== 0;
  }

  searchInput.addEventListener('input', updateDirectory);
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
  });
  filterList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button || !filterList.contains(button)) return;

    activeFilter = button.dataset.filter;
    updateDirectory();
  });

  resetSearch.addEventListener('click', () => {
    searchInput.value = '';
    activeFilter = 'all';
    updateDirectory();
    searchInput.focus();
  });

  randomCity.addEventListener('click', () => {
    if (!visibleCities.length) return;

    const city = visibleCities[Math.floor(Math.random() * visibleCities.length)];
    const card = cityGrid.querySelector(`#city-${city.slug}`);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    card?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    openCity(city, randomCity);
  });

  updateDirectory();
  decorateIcons(document);
}

if (typeof document !== 'undefined') {
  initialize();
}
