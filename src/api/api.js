export const getDetails = async () => {
  const response = await fetch('http://localhost:4000/get-details');
  if (!response.ok) throw new Error('Failed to fetch details');
  return response.json();
};

export const getProducts = async () => {
  const response = await fetch('http://localhost:4000/products');
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};