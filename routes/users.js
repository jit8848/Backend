const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { registerUser, findUserByEmail, updatePassword } = require('../models/userModel');  // Use model functions

// Register a new user with express-validator
router.post(
  '/register',
  [
    check('fullName', 'Full Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    check('role', 'Role must be either admin, seller, or user').isIn(['admin', 'seller', 'user']),
    check('phoneNumber', 'Phone number is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('dateOfBirth', 'Please include a valid date of birth').isDate()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, role, phoneNumber, address, dateOfBirth } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Register the user
      const newUser = await registerUser(fullName, email, hashedPassword, role, phoneNumber, address, dateOfBirth);

      // Create a payload and generate the JWT token
      const payload = { user: { id: newUser.id, role: newUser.role } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Login a user with express-validator
router.post(
  '/login',
  [
    // Validate 'email' and 'password'
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // Debugging: Log the incoming request body to check if it's being parsed correctly
    console.log('Request body:', req.body);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Ensure there are no extra fields
    const allowedFields = ['email', 'password'];
    const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));

    if (extraFields.length > 0) {
      console.log('Extra fields found:', extraFields);  // Debugging: Log the extra fields
      return res.status(400).json({ message: 'Only email and password are allowed for login' });
    }

    try {
      // Check if the user exists
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Compare the password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create a payload and generate the JWT token
      const payload = { user: { id: user.id, role: user.role } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Forgot password route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Here, send resetToken via email to the user (email sending not shown)
    console.log('Reset token:', resetToken);

    res.json({ message: 'Password reset token sent to email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await updatePassword(userId, hashedPassword);
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
