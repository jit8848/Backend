const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getSellerById, fetchProductsBySeller, fetchOrdersBySeller } = require('../models/sellerModel');
const { deleteProductById } = require('../models/productModel'); // Use model functions

// Seller Dashboard Route - Fetch profile, products, and orders
router.get('/dashboard', auth(['seller']), async (req, res) => {
  const sellerId = req.user.id; // Get the seller's ID from the authenticated user

  try {
    // Fetch seller profile details
    const seller = await getSellerById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Fetch products the seller is selling
    const products = await fetchProductsBySeller(sellerId);

    // Fetch orders made for the seller's products
    const orders = await fetchOrdersBySeller(sellerId);

    res.json({
      seller,    // Seller profile details
      products,  // List of products seller is selling
      orders     // List of orders made for the seller's products
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Seller: Fetch All Products (Only for sellers)
router.get('/my-products', auth(['seller']), async (req, res) => {
  try {
    const products = await fetchProductsBySeller(req.user.id);
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Seller: Delete a Product (Only for sellers)
router.delete('/delete-product/:id', auth(['seller']), async (req, res) => {
  const productId = req.params.id;

  try {
    await deleteProductById(productId);
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
