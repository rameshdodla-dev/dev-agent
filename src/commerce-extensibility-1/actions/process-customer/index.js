import { buildProcessedCustomer, validateCustomer } from './customer.js';

function logProcessedCustomer(processedCustomer) {
  console.log('Commerce customer event received');
  console.log(`Customer ID: ${processedCustomer.customerId}`);
  console.log(`Full Name: ${processedCustomer.fullName}`);
  console.log(`Email: ${processedCustomer.email}`);
  console.log(`Customer Type: ${processedCustomer.customerType}`);
  console.log(`Processed: ${processedCustomer.processed}`);
}

function logValidationFailure(data, missingFields) {
  console.log('Commerce customer event received');
  console.log(`Customer ID: ${data?.id ?? 'unknown'}`);
  console.log(`Processed: false`);
  console.log(`Validation Error: missing required fields: ${missingFields.join(', ')}`);
}

export async function main(params) {
  try {
    const data = params?.data?.value;

    const validation = validateCustomer(data);
    if (!validation.valid) {
      logValidationFailure(data, validation.missingFields);
      return {
        statusCode: 200,
        body: {
          processed: false,
          missingFields: validation.missingFields,
        },
      };
    }

    const processedCustomer = buildProcessedCustomer(data);
    logProcessedCustomer(processedCustomer);

    return {
      statusCode: 200,
      body: processedCustomer,
    };
  } catch (error) {
    console.error('Failed to process customer event', {
      error: error?.message,
    });

    return {
      statusCode: 500,
      body: {
        error: 'Failed to process customer event',
      },
    };
  }
}
