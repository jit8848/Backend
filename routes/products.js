const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const client = require('../db');  // Import PostgreSQL client
const { 
  addProduct, 
  updateProduct, 
  deleteProductById, 
  fetchProductsBySeller, 
  fetchAllProducts 
} = require('../models/productModel');  // Use model functions

// Add a new product (Only for sellers)
router.post('/add', auth('seller'), async (req, res) => {
  const { name, category, price, quantity, description, images } = req.body;

  try {
    const newProduct = await addProduct(name, category, price, quantity, description, images, req.user.id);
    res.json(newProduct);
  } catch (err) {
    console.error('Error adding product:', err.message);
    res.status(500).send('Server error');
  }
});

// Update a product (Only for sellers)
router.put('/update/:id', auth('seller'), async (req, res) => {
  const { name, category, price, quantity, description, images } = req.body;
  const productId = req.params.id;

  try {
    const updatedProduct = await updateProduct(productId, name, category, price, quantity, description, images);
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err.message);
    res.status(500).send('Server error');
  }
});

// Delete a product (Only for sellers)
router.delete('/delete/:id', auth('seller'), async (req, res) => {
  const productId = req.params.id;

  try {
    await deleteProductById(productId);
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all products (Accessible to all users)
router.get('/', async (req, res) => {
  try {
    const products = await fetchAllProducts();
    res.json(products);
  } catch (err) {
    console.error('Error fetching all products:', err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all products by a seller (Only for sellers)
router.get('/my-products', auth('seller'), async (req, res) => {
  try {
    const products = await fetchProductsBySeller(req.user.id);
    res.json(products);
  } catch (err) {
    console.error('Error fetching seller products:', err.message);
    res.status(500).send('Server error');
  }
});

// Search, filter, and sort products
router.get('/search', async (req, res) => {
  const { name, category, minPrice, maxPrice, sortBy, order } = req.query;

  try {
    // Construct dynamic SQL query with optional parameters
    const query = `
      SELECT * FROM products
      WHERE
        ($1::text IS NULL OR name ILIKE '%' || $1 || '%')
        AND ($2::text IS NULL OR category = $2)
        AND ($3::numeric IS NULL OR price >= $3)
        AND ($4::numeric IS NULL OR price <= $4)
      ORDER BY
        CASE WHEN $5 = 'price' THEN price END ${order || 'ASC'},
        CASE WHEN $5 = 'name' THEN name END ${order || 'ASC'}
    `;

    const values = [name, category, minPrice, maxPrice, sortBy];

    const result = await client.query(query, values);  // Use client for PostgreSQL queries
    res.json(result.rows);
  } catch (err) {
    console.error('Error searching/filtering products:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
