#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const REQUIRED_RUNTIME_FIELDS = [
  'name',
  'image',
  'brand',
  'category',
  'description',
  'price',
  'countInStock',
];

const IDENTIFIER_FIELDS = ['code', 'number', 'identifier'];

// These values come only from the repository's current legacy third-party
// catalogue. They are blocked to prevent accidental carry-over into the final
// Burnsville replacement dataset. Generic ingredient/flavour words are not
// blocked.
const LEGACY_THIRD_PARTY_BRANDS = [
  'Yuzu Heaven',
  'Hot Ones',
  'Torchbearer',
  'Seed Ranch',
  'The Last Dab',
  'Puckerbutt',
  'Adoboloco',
  'Hell Fire Detroit',
];

const LEGACY_THIRD_PARTY_PRODUCT_NAMES = [
  'Mellow Habanero | Yuzu Heaven',
  'Hot Ones | The Last Dab XXX',
  'Torchbearer | Reaper Evil',
  'Seed Ranch | Hot Thai Green',
  'The Last Dab | APOLLO',
  'Puckerbutt | Chocolate Plague',
  'Adoboloco | Hamajang Kiawe Smoked Ghost Pepper',
  'Hell Fire Detroit | Habanero',
  'Hot Ones | The Constrictor',
  'Hot Ones | Brain Burner',
];

const PENDING_MARKERS = new Set([
  'pending',
  'tbd',
  'to be confirmed',
  'to be supplied',
  'unresolved',
]);

const IMAGE_PATH_PATTERN = /^\/images\/[A-Za-z0-9._~!$&'()*+,;=:@%/-]+\.(?:webp|png|jpe?g)$/i;

const normaliseText = (value) => String(value ?? '').trim().toLowerCase();

const isBlank = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && value.trim() === '');

const isPendingValue = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  const normalised = normaliseText(value);
  return PENDING_MARKERS.has(normalised) || /\bpending\b/i.test(value);
};

const containsPendingValue = (value) => {
  if (isPendingValue(value)) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(containsPendingValue);
  }

  if (value && typeof value === 'object') {
    return Object.values(value).some(containsPendingValue);
  }

  return false;
};

const extractProducts = (source) => {
  if (Array.isArray(source)) {
    return source;
  }

  if (!source || typeof source !== 'object') {
    throw new Error('Catalogue JSON must be an array or an object containing product arrays.');
  }

  if (Array.isArray(source.products)) {
    return source.products;
  }

  const groupedProducts = [
    ...(Array.isArray(source.core) ? source.core : []),
    ...(Array.isArray(source.limited_vintage) ? source.limited_vintage : []),
  ];

  if (groupedProducts.length > 0) {
    return groupedProducts;
  }

  throw new Error(
    'No product array found. Expected an array, { products: [...] }, or { core: [...], limited_vintage: [...] }.'
  );
};

const findIdentifier = (product) => {
  for (const field of IDENTIFIER_FIELDS) {
    if (!isBlank(product[field])) {
      return { field, value: String(product[field]).trim() };
    }
  }

  return null;
};

const productLabel = (product, index) => {
  const identifier = findIdentifier(product);
  const name = isBlank(product?.name) ? 'UNNAMED' : String(product.name).trim();
  return identifier
    ? `#${index + 1} ${name} (${identifier.field}: ${identifier.value})`
    : `#${index + 1} ${name}`;
};

const addIssue = (issues, level, product, index, message) => {
  issues.push({
    level,
    label: productLabel(product, index),
    message,
  });
};

const validateCatalogue = (products) => {
  const issues = [];
  const seenNames = new Map();
  const seenIdentifiers = new Map();
  const seenImages = new Map();

  products.forEach((product, index) => {
    if (!product || typeof product !== 'object' || Array.isArray(product)) {
      addIssue(issues, 'ERROR', {}, index, 'Product entry must be a JSON object.');
      return;
    }

    for (const field of REQUIRED_RUNTIME_FIELDS) {
      if (isBlank(product[field])) {
        addIssue(issues, 'ERROR', product, index, `Missing required runtime field: ${field}.`);
      }
    }

    if (containsPendingValue(product)) {
      addIssue(issues, 'ERROR', product, index, 'Contains an unresolved PENDING/TBD value.');
    }

    if (!isBlank(product.name)) {
      const key = normaliseText(product.name);
      if (seenNames.has(key)) {
        addIssue(
          issues,
          'ERROR',
          product,
          index,
          `Duplicate product name; first seen at entry #${seenNames.get(key) + 1}.`
        );
      } else {
        seenNames.set(key, index);
      }
    }

    const identifier = findIdentifier(product);
    if (identifier) {
      const key = normaliseText(identifier.value);
      if (seenIdentifiers.has(key)) {
        addIssue(
          issues,
          'ERROR',
          product,
          index,
          `Duplicate product identifier/code; first seen at entry #${seenIdentifiers.get(key) + 1}.`
        );
      } else {
        seenIdentifiers.set(key, index);
      }
    }

    if (!isBlank(product.image)) {
      const image = String(product.image).trim();
      const imageKey = normaliseText(image);

      if (!IMAGE_PATH_PATTERN.test(image)) {
        addIssue(
          issues,
          'ERROR',
          product,
          index,
          'Invalid image path. Expected /images/... with .webp, .png, .jpg or .jpeg extension and no spaces.'
        );
      }

      if (seenImages.has(imageKey)) {
        addIssue(
          issues,
          'ERROR',
          product,
          index,
          `Duplicate image path; first seen at entry #${seenImages.get(imageKey) + 1}.`
        );
      } else {
        seenImages.set(imageKey, index);
      }
    }

    if (!isBlank(product.heatLevel)) {
      const heat = Number(product.heatLevel);
      if (!Number.isInteger(heat) || heat < 1 || heat > 10) {
        addIssue(issues, 'ERROR', product, index, 'heatLevel must be a whole number from 1 to 10 when supplied.');
      }
    }

    if (!isBlank(product.price)) {
      const price = Number(product.price);
      if (!Number.isFinite(price) || price < 0) {
        addIssue(issues, 'ERROR', product, index, 'price must be a finite number greater than or equal to 0.');
      }
    }

    if (!isBlank(product.countInStock)) {
      const stock = Number(product.countInStock);
      if (!Number.isInteger(stock) || stock < 0) {
        addIssue(issues, 'ERROR', product, index, 'countInStock must be a whole number greater than or equal to 0.');
      }
    }

    if (!isBlank(product.brand) && normaliseText(product.brand) !== 'burnsville') {
      addIssue(
        issues,
        'ERROR',
        product,
        index,
        `Unexpected brand "${String(product.brand).trim()}". Final Burnsville replacement products must use the Burnsville brand.`
      );
    }

    const searchable = JSON.stringify(product).toLowerCase();

    for (const legacyBrand of LEGACY_THIRD_PARTY_BRANDS) {
      if (searchable.includes(legacyBrand.toLowerCase())) {
        addIssue(
          issues,
          'ERROR',
          product,
          index,
          `Legacy third-party brand content detected: ${legacyBrand}.`
        );
      }
    }

    for (const legacyName of LEGACY_THIRD_PARTY_PRODUCT_NAMES) {
      if (searchable.includes(legacyName.toLowerCase())) {
        addIssue(
          issues,
          'ERROR',
          product,
          index,
          `Legacy third-party product content detected: ${legacyName}.`
        );
      }
    }
  });

  return issues;
};

const printUsage = () => {
  console.log('Usage: node qa/block-11d-validate-final-catalogue.mjs <catalogue.json>');
  console.log('');
  console.log('Accepted JSON shapes:');
  console.log('  [ ...products ]');
  console.log('  { "products": [ ...products ] }');
  console.log('  { "core": [ ... ], "limited_vintage": [ ... ] }');
  console.log('');
  console.log('This validator is read-only and does not connect to MongoDB.');
};

const main = async () => {
  const argument = process.argv[2];

  if (!argument || argument === '--help' || argument === '-h') {
    printUsage();
    process.exit(argument ? 0 : 2);
  }

  const cataloguePath = path.resolve(process.cwd(), argument);
  let source;

  try {
    source = JSON.parse(await readFile(cataloguePath, 'utf8'));
  } catch (error) {
    console.error(`CATALOGUE VALIDATION: FAIL\nUnable to read/parse ${cataloguePath}\n${error.message}`);
    process.exit(1);
  }

  let products;
  try {
    products = extractProducts(source);
  } catch (error) {
    console.error(`CATALOGUE VALIDATION: FAIL\n${error.message}`);
    process.exit(1);
  }

  if (products.length === 0) {
    console.error('CATALOGUE VALIDATION: FAIL\nCatalogue contains zero products.');
    process.exit(1);
  }

  const issues = validateCatalogue(products);
  const errors = issues.filter((issue) => issue.level === 'ERROR');

  console.log(`BURNSVILLE FINAL CATALOGUE VALIDATOR`);
  console.log(`Source: ${cataloguePath}`);
  console.log(`Products checked: ${products.length}`);

  if (issues.length > 0) {
    console.log('');
    for (const issue of issues) {
      console.log(`[${issue.level}] ${issue.label} — ${issue.message}`);
    }
  }

  console.log('');
  if (errors.length > 0) {
    console.error(`CATALOGUE VALIDATION: FAIL (${errors.length} error${errors.length === 1 ? '' : 's'})`);
    process.exit(1);
  }

  console.log('CATALOGUE VALIDATION: PASS');
};

await main();
