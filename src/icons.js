const paths = {
  search: '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>',
  'arrow-down': '<path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path>',
  'arrow-up-right': '<path d="M7 7h10v10"></path><path d="M7 17 17 7"></path>',
  'map-pin': '<path d="M20 10c0 5-8 12-8 12s-8-7-8-12a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle>',
  clock: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a3 3 0 0 0 0 6h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a3 3 0 0 1-3-3V6"></path><path d="M16 13h2"></path>',
  calendar: '<path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>',
  landmark: '<line x1="3" x2="21" y1="22" y2="22"></line><line x1="6" x2="6" y1="18" y2="11"></line><line x1="10" x2="10" y1="18" y2="11"></line><line x1="14" x2="14" y1="18" y2="11"></line><line x1="18" x2="18" y1="18" y2="11"></line><polygon points="12 2 20 7 4 7"></polygon>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>',
  sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path>',
  hotel: '<path d="M10 22v-6.6"></path><path d="M14 22v-6.6"></path><path d="M18 8v14"></path><path d="M18 18h4"></path><path d="M2 22h20"></path><path d="M6 8v14"></path><path d="M6 4V2h12v6"></path><path d="M10 6h.01"></path><path d="M14 6h.01"></path><path d="M10 10h.01"></path><path d="M14 10h.01"></path><path d="M10 14h.01"></path><path d="M14 14h.01"></path><path d="M2 18h4"></path><path d="M2 8h4"></path><path d="M18 8h4v14"></path><path d="M2 8v14"></path>',
  'train-front': '<rect width="16" height="16" x="4" y="3" rx="2"></rect><path d="M4 11h16"></path><path d="M12 3v8"></path><path d="m8 19-2 3"></path><path d="m16 19 2 3"></path><path d="M8 15h.01"></path><path d="M16 15h.01"></path>',
  'triangle-alert': '<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
  x: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
};

export function icon(name, size = 24) {
  const content = paths[name];
  if (!content) return '';

  const dimension = Number.isFinite(size) && size > 0 ? size : 24;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${dimension}" height="${dimension}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`;
}
