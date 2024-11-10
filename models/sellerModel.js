const client = require('../db'); // PostgreSQL connection

// Fetch seller profile by seller ID
const getSellerById = async (sellerId) => {
  const query = 'SELECT id, full_name, email, phone_number, address FROM users WHERE id = $1 AND role = $2';
  const values = [sellerId, 'seller'];
  
  const result = await client.query(query, values);
  return result.rows[0]; // Return seller's data
};

// Fetch products by seller ID
const fetchProductsBySeller = async (sellerId) => {
  const query = 'SELECT * FROM products WHERE seller_id = $1';
  const values = [sellerId];
  
  const result = await client.query(query, values);
  return result.rows; // Return the seller's products
};

// Fetch orders for the seller's products
const fetchOrdersBySeller = async (sellerId) => {
  const query = `
    SELECT o.id, o.quantity, o.total_price, o.status, p.name AS product_name, u.full_name AS buyer_name 
    FROM orders o
    JOIN products p ON o.product_id = p.id
    JOIN users u ON o.buyer_id = u.id
    WHERE o.seller_id = $1
  `;
  
  const values = [sellerId];
  const result = await client.query(query, values);
  
  return result.rows; // Return the list of orders for the seller
};

// Update seller profile
const updateSellerProfile = async (sellerId, { fullName, email, phoneNumber, address }) => {
  const query = `
    UPDATE users 
    SET full_name = $1, email = $2, phone_number = $3, address = $4 
    WHERE id = $5 AND role = $6 
    RETURNING id, full_name, email, phone_number, address
  `;
  const values = [fullName, email, phoneNumber, address, sellerId, 'seller'];

  const result = await client.query(query, values);
  return result.rows[0]; // Return updated seller data
};

module.exports = {
  getSellerById,
  fetchProductsBySeller,
  fetchOrdersBySeller,   // New function to fetch orders
  updateSellerProfile
};
