import assert from 'node:assert/strict';
import test from 'node:test';
import { buildProcessedCustomer, validateCustomer } from './customer.js';

test('validateCustomer accepts a complete customer payload', () => {
  const result = validateCustomer({
    id: 100245,
    email: 'john.doe@example.com',
    firstname: 'John',
    lastname: 'Doe',
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.missingFields, []);
});

test('validateCustomer reports missing required fields', () => {
  const result = validateCustomer({
    id: 100245,
    email: 'john.doe@example.com',
    firstname: 'John',
  });

  assert.equal(result.valid, false);
  assert.deepEqual(result.missingFields, ['lastname']);
});

test('buildProcessedCustomer assembles the required output shape', () => {
  const result = buildProcessedCustomer({
    id: 100245,
    email: 'john.doe@example.com',
    firstname: 'John',
    lastname: 'Doe',
  });

  assert.deepEqual(result, {
    customerId: 100245,
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    customerType: 'new-commerce-customer',
    processed: true,
  });
});
