const skuCollections = {
  SOF: 'Sofas',
  CHR: 'Chairs',
  TBL: 'Tables',
  BED: 'Bedroom',
  DIN: 'Dining Tables',
  LIV: 'Living Room',
  OFC: 'Office',
};

const categoryAliases = new Map([
  ['sofa', 'Sofas'],
  ['sofas', 'Sofas'],
  ['chair', 'Chairs'],
  ['chairs', 'Chairs'],
  ['table', 'Tables'],
  ['tables', 'Tables'],
  ['bed', 'Bedroom'],
  ['bedroom bed', 'Bedroom'],
  ['bedroom', 'Bedroom'],
  ['dinning table', 'Dining Tables'],
  ['dining table', 'Dining Tables'],
  ['dining tables', 'Dining Tables'],
  ['dining', 'Dining'],
  ['living room furniture', 'Living Room'],
  ['living room', 'Living Room'],
  ['office furniture', 'Office'],
]);

export function normalizeCollectionName(value) {
  const normalized = String(value || '').trim().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
  if (!normalized) return '';

  const alias = categoryAliases.get(normalized.toLowerCase());
  if (alias) return alias;

  return normalized.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getProductCollectionNames(product) {
  const names = new Set();
  const category = normalizeCollectionName(product.category);
  const subcategory = normalizeCollectionName(product.subcategory);

  if (category) names.add(category);
  if (subcategory) names.add(subcategory);

  const skuPrefix = String(product.sku || '').match(/(?:UPL-)?([A-Z]+)-\d+/i)?.[1]?.toUpperCase();
  const skuCollection = skuCollections[skuPrefix];
  if (skuCollection) names.add(skuCollection);

  if (names.size === 0) {
    const name = String(product.name || '').toLowerCase();
    const inferred = [...categoryAliases.entries()]
      .sort(([left], [right]) => right.length - left.length)
      .find(([term]) => name.includes(term));
    if (inferred) names.add(inferred[1]);
  }

  return [...names];
}

export function getProductCollections(products) {
  const collections = new Map();

  products.forEach((product) => {
    getProductCollectionNames(product).forEach((name) => {
      if (!collections.has(name)) collections.set(name, []);
      collections.get(name).push(product);
    });
  });

  return [...collections.entries()]
    .map(([name, items]) => ({ name, products: items }))
    .sort((left, right) => left.name.localeCompare(right.name));
}
