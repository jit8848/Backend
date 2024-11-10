const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserById, updateUserProfile } = require('../models/userModel');

// Fetch profile (works for seller, user, or admin based on their role)
router.get('/profile', auth(['seller', 'user', 'admin']), async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update profile (works for seller, user, or admin based on their role)
router.put('/profile', auth(['seller', 'user', 'admin']), async (req, res) => {
  const { fullName, email, phoneNumber, address } = req.body;

  try {
    const updatedUser = await updateUserProfile(req.user.id, { fullName, email, phoneNumber, address });
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
