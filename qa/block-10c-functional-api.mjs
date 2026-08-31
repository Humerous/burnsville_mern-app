import assert from 'node:assert/strict';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:5001';
const runId = `${Date.now()}-${process.pid}`;
const password = 'Block10C!Pass123';
const primaryEmail = `block10c-primary-${runId}@example.test`;
const primaryUpdatedEmail = `block10c-primary-updated-${runId}@example.test`;
const secondaryEmail = `block10c-secondary-${runId}@example.test`;
const productName = `Block 10C Synthetic Sauce ${runId}`;

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
      // Keep non-JSON responses as text for diagnostics.
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

let adminToken = '';
let primaryToken = '';
let secondaryToken = '';
let primaryUserId = '';
let secondaryUserId = '';
let syntheticProductId = '';
let syntheticOrderId = '';

const cleanup = async () => {
  if (!adminToken) {
    return;
  }

  const cleanupRequests = [];

  if (syntheticProductId) {
    cleanupRequests.push(
      request(`/api/products/${syntheticProductId}`, {
        method: 'DELETE',
        token: adminToken,
      })
    );
  }

  if (primaryUserId) {
    cleanupRequests.push(
      request(`/api/users/${primaryUserId}`, {
        method: 'DELETE',
        token: adminToken,
      })
    );
  }

  if (secondaryUserId) {
    cleanupRequests.push(
      request(`/api/users/${secondaryUserId}`, {
        method: 'DELETE',
        token: adminToken,
      })
    );
  }

  const results = await Promise.allSettled(cleanupRequests);
  for (const result of results) {
    if (result.status === 'rejected') {
      console.warn(`QA cleanup warning: ${result.reason}`);
    }
  }

  if (syntheticOrderId) {
    console.log(
      `QA cleanup: order ${syntheticOrderId} remains only inside the isolated CI database; the workflow destroys that database container after the job.`
    );
  }
};

try {
  console.log('BLOCK 10C: authenticate isolated admin fixture');
  const adminLogin = await request('/api/users/login', {
    method: 'POST',
    body: { email: 'admin@example.com', password: '123456' },
  });
  expectStatus(adminLogin, 200, 'Admin fixture login');
  assert.equal(adminLogin.data.isAdmin, true, 'Admin fixture role missing');
  assert.ok(adminLogin.data.token, 'Admin fixture token missing');
  adminToken = adminLogin.data.token;

  console.log('BLOCK 10C: registration and login verification');
  const registration = await request('/api/users', {
    method: 'POST',
    body: {
      name: '  Block 10C Primary  ',
      email: `  ${primaryEmail.toUpperCase()}  `,
      password,
    },
  });
  expectStatus(registration, 201, 'Primary synthetic registration');
  assert.equal(registration.data.name, 'Block 10C Primary', 'Registered name not normalized');
  assert.equal(registration.data.email, primaryEmail, 'Registered email not normalized');
  assert.equal(registration.data.isAdmin, false, 'Synthetic customer unexpectedly admin');
  assert.ok(registration.data.token, 'Registration token missing');
  primaryToken = registration.data.token;
  primaryUserId = registration.data._id;

  const login = await request('/api/users/login', {
    method: 'POST',
    body: {
      email: ` ${primaryEmail.toUpperCase()} `,
      password,
    },
  });
  expectStatus(login, 200, 'Primary synthetic login');
  assert.equal(login.data._id, primaryUserId, 'Login returned wrong user');
  assert.ok(login.data.token, 'Login token missing');
  primaryToken = login.data.token;

  const invalidLogin = await request('/api/users/login', {
    method: 'POST',
    body: { email: primaryEmail, password: 'DefinitelyWrong123!' },
  });
  expectStatus(invalidLogin, 401, 'Invalid password rejection');

  const secondaryRegistration = await request('/api/users', {
    method: 'POST',
    body: {
      name: 'Block 10C Secondary',
      email: secondaryEmail,
      password,
    },
  });
  expectStatus(secondaryRegistration, 201, 'Secondary synthetic registration');
  secondaryToken = secondaryRegistration.data.token;
  secondaryUserId = secondaryRegistration.data._id;

  console.log('BLOCK 10C: profile update verification');
  const profileUpdate = await request('/api/users/profile', {
    method: 'PUT',
    token: primaryToken,
    body: {
      name: '  Block 10C Primary Updated  ',
      email: ` ${primaryUpdatedEmail.toUpperCase()} `,
    },
  });
  expectStatus(profileUpdate, 200, 'Profile update');
  assert.equal(profileUpdate.data.name, 'Block 10C Primary Updated', 'Updated name not normalized');
  assert.equal(profileUpdate.data.email, primaryUpdatedEmail, 'Updated email not normalized');
  assert.ok(profileUpdate.data.token, 'Updated profile token missing');
  primaryToken = profileUpdate.data.token;

  const updatedProfile = await request('/api/users/profile', {
    token: primaryToken,
  });
  expectStatus(updatedProfile, 200, 'Updated profile retrieval');
  assert.equal(updatedProfile.data.email, primaryUpdatedEmail, 'Profile update not persisted');
  assert.ok(
    !Object.prototype.hasOwnProperty.call(updatedProfile.data, 'password'),
    'Profile response exposed password field'
  );

  const updatedLogin = await request('/api/users/login', {
    method: 'POST',
    body: { email: primaryUpdatedEmail, password },
  });
  expectStatus(updatedLogin, 200, 'Updated-email login');
  primaryToken = updatedLogin.data.token;

  console.log('BLOCK 10C: admin API boundary verification');
  const customerUserList = await request('/api/users', { token: primaryToken });
  expectStatus(customerUserList, 403, 'Customer user-list denial');

  const customerOrderList = await request('/api/orders', { token: primaryToken });
  expectStatus(customerOrderList, 403, 'Customer order-list denial');

  const customerProductCreate = await request('/api/products', {
    method: 'POST',
    token: primaryToken,
    body: {},
  });
  expectStatus(customerProductCreate, 403, 'Customer product-create denial');

  const adminUserList = await request('/api/users', { token: adminToken });
  expectStatus(adminUserList, 200, 'Admin user list');
  assert.ok(Array.isArray(adminUserList.data), 'Admin user list is not an array');
  assert.ok(
    adminUserList.data.some((user) => user._id === primaryUserId),
    'Admin user list missing primary synthetic user'
  );

  const customerUserDetail = await request(`/api/users/${primaryUserId}`, {
    token: primaryToken,
  });
  expectStatus(customerUserDetail, 403, 'Customer admin user-detail denial');

  const adminUserDetail = await request(`/api/users/${primaryUserId}`, {
    token: adminToken,
  });
  expectStatus(adminUserDetail, 200, 'Admin user detail');

  console.log('BLOCK 10C: controlled synthetic product creation');
  const productCreate = await request('/api/products', {
    method: 'POST',
    token: adminToken,
    body: {},
  });
  expectStatus(productCreate, 201, 'Admin synthetic product creation');
  syntheticProductId = productCreate.data._id;

  const syntheticProduct = {
    _id: syntheticProductId,
    name: productName,
    price: 129.95,
    image: '/images/sample.jpg',
    brand: 'Burnsville QA',
    category: 'Synthetic QA',
    countInStock: 6,
    description: 'Controlled Block 10C synthetic product used only in the isolated QA database.',
    heatLevel: 3,
    flavourProfile: 'Citrus, smoke, controlled QA',
    pairings: ['Tacos', 'Wings'],
    ingredients: 'Synthetic QA fixture only',
  };

  const productUpdate = await request(`/api/products/${syntheticProductId}`, {
    method: 'PUT',
    token: adminToken,
    body: syntheticProduct,
  });
  expectStatus(productUpdate, 200, 'Admin synthetic product update');
  assert.equal(productUpdate.data.name, productName, 'Synthetic product name not persisted');
  assert.equal(productUpdate.data.heatLevel, 3, 'Synthetic heat level not persisted');

  const customerProductUpdate = await request(`/api/products/${syntheticProductId}`, {
    method: 'PUT',
    token: primaryToken,
    body: syntheticProduct,
  });
  expectStatus(customerProductUpdate, 403, 'Customer product-update denial');

  console.log('BLOCK 10C: catalogue and product-detail verification');
  const catalogue = await request(
    `/api/products?keyword=${encodeURIComponent(productName)}&pageNumber=1`
  );
  expectStatus(catalogue, 200, 'Synthetic catalogue query');
  assert.ok(Array.isArray(catalogue.data.products), 'Catalogue products missing');
  assert.ok(
    catalogue.data.products.some((product) => product._id === syntheticProductId),
    'Synthetic product missing from catalogue query'
  );

  const productDetail = await request(`/api/products/${syntheticProductId}`);
  expectStatus(productDetail, 200, 'Synthetic product detail');
  assert.equal(productDetail.data.name, productName, 'Product detail returned wrong product');
  assert.equal(productDetail.data.countInStock, 6, 'Synthetic product starting stock incorrect');
  assert.deepEqual(productDetail.data.pairings, ['Tacos', 'Wings'], 'Synthetic pairings incorrect');

  console.log('BLOCK 10C: review-submission verification');
  const unauthenticatedReview = await request(`/api/products/${syntheticProductId}/reviews`, {
    method: 'POST',
    body: { rating: 4, comment: 'Should not be accepted' },
  });
  expectStatus(unauthenticatedReview, 401, 'Unauthenticated review denial');

  const reviewCreate = await request(`/api/products/${syntheticProductId}/reviews`, {
    method: 'POST',
    token: primaryToken,
    body: { rating: 4, comment: 'Controlled Block 10C review.' },
  });
  expectStatus(reviewCreate, 201, 'Synthetic review creation');

  const reviewedProduct = await request(`/api/products/${syntheticProductId}`);
  expectStatus(reviewedProduct, 200, 'Reviewed product detail');
  assert.equal(reviewedProduct.data.numReviews, 1, 'Review count did not update');
  closeTo(reviewedProduct.data.rating, 4, 'Review average');
  assert.equal(reviewedProduct.data.reviews.length, 1, 'Embedded review missing');
  assert.equal(
    reviewedProduct.data.reviews[0].user,
    primaryUserId,
    'Review ownership does not match primary synthetic user'
  );

  const duplicateReview = await request(`/api/products/${syntheticProductId}/reviews`, {
    method: 'POST',
    token: primaryToken,
    body: { rating: 5, comment: 'Duplicate should be rejected.' },
  });
  expectStatus(duplicateReview, 400, 'Duplicate review rejection');

  console.log('BLOCK 10C: cart-to-order verification');
  const orderCreate = await request('/api/orders', {
    method: 'POST',
    token: primaryToken,
    body: {
      orderItems: [
        {
          product: syntheticProductId,
          qty: 2,
          name: 'FORGED CLIENT NAME',
          image: '/forged-client.jpg',
          price: 0.01,
        },
      ],
      shippingAddress: {
        address: '10 Block C Street',
        city: 'Cape Town',
        postalCode: '8001',
        country: 'South Africa',
      },
      paymentMethod: 'Peach Payments',
      itemsPrice: 0.01,
      shippingPrice: 0,
      vatPrice: 0,
      totalPrice: 0.01,
    },
  });
  expectStatus(orderCreate, 201, 'Synthetic order creation');
  syntheticOrderId = orderCreate.data._id;

  const expectedItemsPrice = roundCurrency(129.95 * 2);
  const expectedShipping = expectedItemsPrice > 100 ? 0 : 100;
  const expectedVat = roundCurrency(expectedItemsPrice * 0.15);
  const expectedTotal = roundCurrency(expectedItemsPrice + expectedShipping + expectedVat);

  assert.equal(orderCreate.data.orderItems[0].name, productName, 'Server did not enforce product name');
  closeTo(orderCreate.data.orderItems[0].price, 129.95, 'Server did not enforce product price');
  closeTo(orderCreate.data.itemsPrice, expectedItemsPrice, 'Authoritative items subtotal');
  closeTo(orderCreate.data.shippingPrice, expectedShipping, 'Authoritative shipping total');
  closeTo(orderCreate.data.vatPrice, expectedVat, 'Authoritative VAT total');
  closeTo(orderCreate.data.totalPrice, expectedTotal, 'Authoritative order total');
  assert.equal(orderCreate.data.paymentMethod, 'Peach Payments', 'Payment method not persisted');

  const productAfterOrder = await request(`/api/products/${syntheticProductId}`);
  expectStatus(productAfterOrder, 200, 'Product detail after synthetic order');
  assert.equal(productAfterOrder.data.countInStock, 4, 'Order did not decrement stock exactly twice');

  const myOrders = await request('/api/orders/myorders', { token: primaryToken });
  expectStatus(myOrders, 200, 'Primary synthetic order history');
  assert.ok(
    myOrders.data.some((order) => order._id === syntheticOrderId),
    'Synthetic order missing from owner order history'
  );

  const crossCustomerOrder = await request(`/api/orders/${syntheticOrderId}`, {
    token: secondaryToken,
  });
  expectStatus(crossCustomerOrder, 403, 'Cross-customer order denial');

  const adminOrder = await request(`/api/orders/${syntheticOrderId}`, {
    token: adminToken,
  });
  expectStatus(adminOrder, 200, 'Admin synthetic order access');

  const adminOrders = await request('/api/orders', { token: adminToken });
  expectStatus(adminOrders, 200, 'Admin order list');
  assert.ok(
    adminOrders.data.some((order) => order._id === syntheticOrderId),
    'Admin order list missing synthetic order'
  );

  const customerDeliver = await request(`/api/orders/${syntheticOrderId}/deliver`, {
    method: 'PUT',
    token: primaryToken,
    body: {},
  });
  expectStatus(customerDeliver, 403, 'Customer delivery-state denial');

  const adminDeliver = await request(`/api/orders/${syntheticOrderId}/deliver`, {
    method: 'PUT',
    token: adminToken,
    body: {},
  });
  expectStatus(adminDeliver, 200, 'Admin delivery-state update');
  assert.equal(adminDeliver.data.isDelivered, true, 'Admin delivery update not persisted');

  console.log('PASS: Block 10C controlled synthetic functional API QA');
} finally {
  await cleanup();
}
