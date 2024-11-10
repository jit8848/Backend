const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { fetchAllUsers, deleteUserById } = require('../models/userModel');  // Use model functions

// Admin Dashboard Route
router.get('/dashboard', auth(['admin']), (req, res) => {
  res.send('Welcome to the Admin Dashboard!');
});

// Admin: Fetch All Users (Only for admins)
router.get('/users', auth(['admin']), async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Admin: Delete a User (Only for admins)
router.delete('/delete-user/:id', auth(['admin']), async (req, res) => {
  const userId = req.params.id;

  try {
    await deleteUserById(userId);
    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
