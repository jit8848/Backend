const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addInteraction } = require('../models/interactionModel');

// Add product view interaction
router.post('/view', auth('user'), async (req, res) => {
  const { productId } = req.body;

  try {
    const interaction = await addInteraction(req.user.id, productId, 'view');
    res.json(interaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
