import assert from 'node:assert/strict';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:5001';

const fetchText = async (path) => {
  const response = await fetch(`${baseUrl}${path}`);
  const text = await response.text();
  return { status: response.status, text, headers: response.headers };
};

console.log('QA: production root serves Vite output');
const root = await fetchText('/');
assert.equal(root.status, 200, `Root returned ${root.status}`);
assert.match(root.text, /<div id="root"><\/div>/, 'Vite index root mount missing');

const scriptMatch = root.text.match(/<script[^>]+src="([^"]+)"/);
assert.ok(scriptMatch, 'Built JS asset reference missing from Vite index');
const builtScript = await fetchText(scriptMatch[1]);
assert.equal(builtScript.status, 200, `Built JS asset returned ${builtScript.status}`);
assert.match(
  builtScript.headers.get('content-type') || '',
  /javascript|text\/plain/,
  'Built JS asset content type is unexpected'
);

console.log('QA: production SPA fallback');
const spaRoute = await fetchText('/shop');
assert.equal(spaRoute.status, 200, `SPA route returned ${spaRoute.status}`);
assert.match(spaRoute.text, /<div id="root"><\/div>/, 'SPA fallback did not serve index');

console.log('QA: production API still reachable');
const products = await fetch(`${baseUrl}/api/products`);
assert.equal(products.status, 200, `Products API returned ${products.status}`);
const productData = await products.json();
assert.ok(Array.isArray(productData.products), 'Products API payload missing products');

console.log('PASS: production static/runtime QA');
