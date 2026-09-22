import { defineConfig } from '@adobe/aio-commerce-lib-app/config';

export default defineConfig({
  metadata: {
    id: 'customer-save-logger',
    displayName: 'Customer Save Logger',
    description: 'Logs processed customer details when a customer is created or updated in Adobe Commerce.',
    version: '1.0.0',
  },
  eventing: {
    commerce: [
      {
        provider: {
          label: 'Commerce Events Provider',
          description: 'Subscribes to customer save events and routes them to the processing action.',
        },
        events: [
          {
            name: 'observer.customer_save_commit_after',
            label: 'Customer Save Commit After',
            description: 'Triggered after a customer save operation is durably committed.',
            fields: [
              { name: 'id' },
              { name: 'email' },
              { name: 'firstname' },
              { name: 'lastname' },
            ],
            runtimeActions: ['customer-save-logger/process-customer'],
          },
        ],
      },
    ],
  },
});
