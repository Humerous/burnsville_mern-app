import assert from 'node:assert/strict';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:5001';

const request = async (path, options = {}) => {
  const headers = new Headers(options.headers || {});

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  let body = options.body;
  if (body && !(body instanceof FormData) && typeof body !== 'string') {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || 'GET',
    headers,
    body,
  });

  const text = await response.text();
  let data = text;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Keep text response as-is.
    }
  }

  return { status: response.status, data, text };
};

const expectStatus = (result, expected, label) => {
  assert.equal(
    result.status,
    expected,
    `${label}: expected HTTP ${expected}, got ${result.status}: ${result.text}`
  );
};

const roundCurrency = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const closeTo = (actual, expected, label) => {
  assert.ok(
    Math.abs(Number(actual) - Number(expected)) < 0.001,
    `${label}: expected ${expected}, got ${actual}`
  );
};

console.log('QA: API health');
const health = await request('/');
expectStatus(health, 200, 'API health');

console.log('QA: authenticate seeded admin/customer');
const adminLogin = await request('/api/users/login', {
  method: 'POST',
  body: { email: 'admin@example.com', password: '123456' },
});
expectStatus(adminLogin, 200, 'Admin login');
assert.ok(adminLogin.data.token, 'Admin token missing');
assert.equal(adminLogin.data.isAdmin, true, 'Admin role missing');
const adminToken = adminLogin.data.token;

const customerLogin = await request('/api/users/login', {
  method: 'POST',
  body: { email: 'kenny@example.com', password: '123456' },
});
expectStatus(customerLogin, 200, 'Customer login');
const customerToken = customerLogin.data.token;

console.log('QA: user validation and password-hash non-exposure');
const shortPassword = await request('/api/users', {
  method: 'POST',
  body: {
    name: 'Short Password',
    email: 'short@example.com',
    password: 'short',
  },
});
expectStatus(shortPassword, 400, 'Short password rejection');

const qaRegistration = await request('/api/users', {
  method: 'POST',
  body: {
    name: 'QA User',
    email: 'qa@example.com',
    password: 'password123',
  },
});
expectStatus(qaRegistration, 201, 'QA user registration');
assert.ok(qaRegistration.data.token, 'QA user token missing');
const qaToken = qaRegistration.data.token;
const qaUserId = qaRegistration.data._id;

const duplicateEmail = await request('/api/users', {
  method: 'POST',
  body: {
    name: 'Duplicate QA',
    email: ' QA@EXAMPLE.COM ',
    password: 'password123',
  },
});
expectStatus(duplicateEmail, 400, 'Case-insensitive duplicate email rejection');

const adminUsers = await request('/api/users', { token: adminToken });
expectStatus(adminUsers, 200, 'Admin user list');
assert.ok(Array.isArray(adminUsers.data), 'Admin user list is not an array');
assert.ok(
  adminUsers.data.every((user) => !Object.prototype.hasOwnProperty.call(user, 'password')),
  'Admin user list exposed password hashes'
);

const customerUsers = await request('/api/users', { token: customerToken });
expectStatus(customerUsers, 403, 'Customer admin-list denial');

console.log('QA: catalogue and authoritative order pricing');
const catalogue = await request('/api/products');
expectStatus(catalogue, 200, 'Catalogue');
assert.ok(Array.isArray(catalogue.data.products), 'Catalogue products missing');
const product = catalogue.data.products.find((item) => item.countInStock >= 2);
assert.ok(product, 'No in-stock product available for QA');

const productBefore = await request(`/api/products/${product._id}`);
expectStatus(productBefore, 200, 'Product before order');
const stockBefore = productBefore.data.countInStock;

const shippingAddress = {
  address: '1 QA Street',
  city: 'Cape Town',
  postalCode: '8001',
  country: 'South Africa',
};

const createOrder = await request('/api/orders', {
  method: 'POST',
  token: qaToken,
  body: {
    orderItems: [
      {
        product: product._id,
        qty: 1,
        name: 'FORGED NAME',
        image: '/forged.jpg',
        price: 0.01,
      },
    ],
    shippingAddress,
    paymentMethod: 'PayPal',
    itemsPrice: 0.01,
    shippingPrice: 0,
    vatPrice: 0,
    totalPrice: 0.01,
  },
});
expectStatus(createOrder, 201, 'Order creation');
const order = createOrder.data;
assert.ok(order._id, 'Created order id missing');

const expectedItemsPrice = roundCurrency(product.price);
const expectedShipping = expectedItemsPrice > 100 ? 0 : 100;
const expectedVat = roundCurrency(expectedItemsPrice * 0.15);
const expectedTotal = roundCurrency(
  expectedItemsPrice + expectedShipping + expectedVat
);

closeTo(order.orderItems[0].price, product.price, 'Authoritative unit price');
assert.equal(order.orderItems[0].name, product.name, 'Authoritative product name');
closeTo(order.itemsPrice, expectedItemsPrice, 'Authoritative item subtotal');
closeTo(order.shippingPrice, expectedShipping, 'Authoritative shipping');
closeTo(order.vatPrice, expectedVat, 'Authoritative VAT');
closeTo(order.totalPrice, expectedTotal, 'Authoritative total');

const productAfter = await request(`/api/products/${product._id}`);
expectStatus(productAfter, 200, 'Product after order');
assert.equal(
  productAfter.data.countInStock,
  stockBefore - 1,
  'Successful order did not decrement stock exactly once'
);

console.log('QA: order ownership boundaries');
const ownerOrder = await request(`/api/orders/${order._id}`, { token: qaToken });
expectStatus(ownerOrder, 200, 'Owner order access');

const crossCustomerOrder = await request(`/api/orders/${order._id}`, {
  token: customerToken,
});
expectStatus(crossCustomerOrder, 403, 'Cross-customer order denial');

const adminOrder = await request(`/api/orders/${order._id}`, {
  token: adminToken,
});
expectStatus(adminOrder, 200, 'Admin order access');

console.log('QA: stock rejection leaves persisted stock unchanged');
const beforeRejectedOrder = await request(`/api/products/${product._id}`);
const rejectedOrder = await request('/api/orders', {
  method: 'POST',
  token: qaToken,
  body: {
    orderItems: [{ product: product._id, qty: 999999 }],
    shippingAddress,
    paymentMethod: 'PayPal',
  },
});
expectStatus(rejectedOrder, 400, 'Over-stock order rejection');
const afterRejectedOrder = await request(`/api/products/${product._id}`);
assert.equal(
  afterRejectedOrder.data.countInStock,
  beforeRejectedOrder.data.countInStock,
  'Rejected order changed persisted stock'
);

console.log('QA: payment update authorization/input boundary');
const validDemoPayment = {
  id: 'QA-PAYMENT-1',
  status: 'COMPLETED',
  update_time: new Date().toISOString(),
  payer: { email_address: 'qa-payer@example.com' },
};

const crossCustomerPayment = await request(`/api/orders/${order._id}/pay`, {
  method: 'PUT',
  token: customerToken,
  body: validDemoPayment,
});
expectStatus(crossCustomerPayment, 403, 'Cross-customer payment denial');

const malformedPayment = await request(`/api/orders/${order._id}/pay`, {
  method: 'PUT',
  token: qaToken,
  body: { status: 'COMPLETED' },
});
expectStatus(malformedPayment, 400, 'Malformed payment rejection');

const ownerPayment = await request(`/api/orders/${order._id}/pay`, {
  method: 'PUT',
  token: qaToken,
  body: validDemoPayment,
});
expectStatus(ownerPayment, 200, 'Owner demo payment update');
assert.equal(ownerPayment.data.isPaid, true, 'Paid state not persisted');

console.log('QA: upload authorization and binary signature checks');
const unauthUpload = await request('/api/upload', {
  method: 'POST',
  body: new FormData(),
});
expectStatus(unauthUpload, 401, 'Unauthenticated upload denial');

const customerUploadForm = new FormData();
customerUploadForm.append(
  'image',
  new Blob([Buffer.from('not-an-image')], { type: 'image/png' }),
  'test.png'
);
const customerUpload = await request('/api/upload', {
  method: 'POST',
  token: customerToken,
  body: customerUploadForm,
});
expectStatus(customerUpload, 403, 'Non-admin upload denial');

const pngBytes = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
);
const validUploadForm = new FormData();
validUploadForm.append(
  'image',
  new Blob([pngBytes], { type: 'image/png' }),
  'qa.png'
);
const validUpload = await request('/api/upload', {
  method: 'POST',
  token: adminToken,
  body: validUploadForm,
});
expectStatus(validUpload, 201, 'Valid admin upload');
assert.match(validUpload.text, /^\/uploads\/[a-f0-9]{32}\.png$/);
const uploadedAsset = await request(validUpload.text);
expectStatus(uploadedAsset, 200, 'Uploaded asset serving');

const spoofUploadForm = new FormData();
spoofUploadForm.append(
  'image',
  new Blob([Buffer.from('definitely-not-a-png')], { type: 'image/png' }),
  'spoof.png'
);
const spoofUpload = await request('/api/upload', {
  method: 'POST',
  token: adminToken,
  body: spoofUploadForm,
});
expectStatus(spoofUpload, 400, 'Spoofed image rejection');

console.log('QA: deleted-user tokens fail closed');
const deleteQaUser = await request(`/api/users/${qaUserId}`, {
  method: 'DELETE',
  token: adminToken,
});
expectStatus(deleteQaUser, 200, 'Admin delete QA user');

const deletedUserProfile = await request('/api/users/profile', {
  token: qaToken,
});
expectStatus(deletedUserProfile, 401, 'Deleted-user token rejection');

console.log('PASS: integrated API QA');
