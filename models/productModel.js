const client = require('../db');  // PostgreSQL connection

// Add a new product
const addProduct = async (name, category, price, quantity, description, images, sellerId) => {
  const query = `
    INSERT INTO products (name, category, price, quantity, description, images, seller_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
  const values = [name, category, price, quantity, description, images, sellerId];

  const result = await client.query(query, values);
  return result.rows[0];
};

// Update a product
const updateProduct = async (productId, name, category, price, quantity, description, images) => {
  const query = `
    UPDATE products SET name = $1, category = $2, price = $3, quantity = $4, description = $5, images = $6
    WHERE id = $7 RETURNING *`;
  const values = [name, category, price, quantity, description, images, productId];

  const result = await client.query(query, values);
  return result.rows[0];
};

// Delete a product
const deleteProductById = async (productId) => {
  const query = 'DELETE FROM products WHERE id = $1';
  await client.query(query, [productId]);
};

// Fetch all products by seller
const fetchProductsBySeller = async (sellerId) => {
  const query = 'SELECT * FROM products WHERE seller_id = $1';
  const result = await client.query(query, [sellerId]);
  return result.rows;
};

// Fetch all products (for any user)
const fetchAllProducts = async () => {
  const query = 'SELECT * FROM products';
  const result = await client.query(query);
  return result.rows;
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProductById,
  fetchProductsBySeller,
  fetchAllProducts   // Added this function
};
