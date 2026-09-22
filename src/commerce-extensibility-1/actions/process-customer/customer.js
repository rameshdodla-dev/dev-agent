export function validateCustomer(data) {
  const missingFields = [];

  if (!data?.email) missingFields.push('email');
  if (!data?.firstname) missingFields.push('firstname');
  if (!data?.lastname) missingFields.push('lastname');

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}

export function buildProcessedCustomer(data) {
  const firstName = String(data.firstname).trim();
  const lastName = String(data.lastname).trim();
  const fullName = `${firstName} ${lastName}`.trim();

  return {
    customerId: data.id,
    fullName,
    email: data.email,
    customerType: 'new-commerce-customer',
    processed: true,
  };
}
