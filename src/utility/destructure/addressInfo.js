export const formatAddressInfo = (data) => {
  const {
    street,
    city,
    state,
    zip_code,
    permanent_address
  } = data;

  return {
    street: street || '',
    city: city || '',
    state: state || '',
    zip_code: zip_code || '',
    country: 'India', // Defaulting country to 'India'
    permanent_address: permanent_address || ''
  };
};