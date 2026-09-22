import assert from 'node:assert/strict';
import test from 'node:test';
import { main } from './index.js';

function createConsoleSpy() {
  const calls = [];
  const originalLog = console.log;
  const originalError = console.error;

  console.log = (...args) => {
    calls.push({ method: 'log', args });
  };
  console.error = (...args) => {
    calls.push({ method: 'error', args });
  };

  return {
    calls,
    restore() {
      console.log = originalLog;
      console.error = originalError;
    },
  };
}

test('main processes a valid customer event and logs required lines', async () => {
  const spy = createConsoleSpy();

  try {
    const response = await main({
      data: {
        value: {
          id: 100245,
          email: 'john.doe@example.com',
          firstname: 'John',
          lastname: 'Doe',
        },
      },
    });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, {
      customerId: 100245,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      customerType: 'new-commerce-customer',
      processed: true,
    });

    const messages = spy.calls.filter((call) => call.method === 'log').map((call) => call.args.join(' '));
    assert.ok(messages.includes('Commerce customer event received'));
    assert.ok(messages.includes('Customer ID: 100245'));
    assert.ok(messages.includes('Full Name: John Doe'));
    assert.ok(messages.includes('Email: john.doe@example.com'));
    assert.ok(messages.includes('Customer Type: new-commerce-customer'));
    assert.ok(messages.includes('Processed: true'));
    assert.equal(messages.some((message) => message.includes('firstname') || message.includes('lastname') || message.includes('raw event payload')), false);
  } finally {
    spy.restore();
  }
});

test('main swallows validation failures without throwing and avoids raw payload logging', async () => {
  const spy = createConsoleSpy();

  try {
    const response = await main({
      data: {
        value: {
          id: 100245,
          email: 'john.doe@example.com',
          firstname: 'John',
        },
      },
    });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, {
      processed: false,
      missingFields: ['lastname'],
    });

    const messages = spy.calls.filter((call) => call.method === 'log').map((call) => call.args.join(' '));
    assert.ok(messages.includes('Commerce customer event received'));
    assert.ok(messages.includes('Customer ID: 100245'));
    assert.ok(messages.includes('Processed: false'));
    assert.equal(messages.some((message) => message.includes('raw event payload')), false);
  } finally {
    spy.restore();
  }
});
