const express = require('express');
const cors = require('cors');
const client = require('./db');  // PostgreSQL connection
require('dotenv').config();  // Load environment variables

const app = express();

// Middleware to parse JSON requests
app.use(express.json());  // Ensure this is in place

// Enable CORS for all routes
app.use(cors());

// User Routes (registration and login)
app.use('/api/users', require('./routes/users'));

// Product Routes
app.use('/api/products', require('./routes/products'));

// Seller Routes (profile management)
app.use('/api/user-profile', require('./routes/userProfile'));  // Register the seller routes

// Interaction Routes (to track user interactions with products)
app.use('/api/interactions', require('./routes/interactions'));  // Track views/purchases

// Recommendation Routes (to fetch recommended products for users)
app.use('/api/recommendations', require('./routes/recommendation'));  // Fetch recommendations

// Example Route
app.get('/', (req, res) => {
  res.send('Welcome to the B2B Agro E-commerce platform');
});

// Define the PORT and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
