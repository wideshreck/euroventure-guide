export function normalizeTurkish(value = '') {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function filterCities(items, query = '', filter = 'all') {
  const needle = normalizeTurkish(query.trim());

  return items.filter((city) => {
    const filterMatches = filter === 'all' || city.filters.includes(filter);
    const haystack = normalizeTurkish([
      city.name,
      city.country,
      city.mood,
      city.summary,
      ...city.highlights.see,
      ...city.highlights.eat,
      ...city.highlights.do,
    ].join(' '));

    return filterMatches && (!needle || haystack.includes(needle));
  });
}
