const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getRecommendations } = require('../models/recommendationModel');

// Get recommended products for a user based on interactions
router.get('/', auth('user'), async (req, res) => {
  const { category } = req.query;

  try {
    const recommendations = await getRecommendations(req.user.id, category);
    res.json(recommendations);
  } catch (err) {
    console.error('Error fetching recommendations:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
