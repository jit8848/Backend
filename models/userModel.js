const client = require('../db');  // PostgreSQL connection

// Register a new user
const registerUser = async (fullName, email, hashedPassword, role, phoneNumber, address, dateOfBirth) => {
  const query = `
    INSERT INTO users (full_name, email, password, role, phone_number, address, date_of_birth)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
  const values = [fullName, email, hashedPassword, role || 'user', phoneNumber, address, dateOfBirth];
  
  const result = await client.query(query, values);
  return result.rows[0];
};

// Find a user by email
const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await client.query(query, [email]);
  return result.rows[0];
};

// Fetch user/admin/seller by user ID
const getUserById = async (userId) => {
  const query = `
    SELECT id, full_name, email, phone_number, address, role
    FROM users WHERE id = $1`;
  const result = await client.query(query, [userId]);
  return result.rows[0];
};

// Update user/admin/seller profile
const updateUserProfile = async (userId, { fullName, email, phoneNumber, address }) => {
  const query = `
    UPDATE users 
    SET full_name = $1, email = $2, phone_number = $3, address = $4 
    WHERE id = $5 RETURNING id, full_name, email, phone_number, address, role`;
  const values = [fullName, email, phoneNumber, address, userId];

  const result = await client.query(query, values);
  return result.rows[0];
};

// Fetch all users (Admin operation)
const fetchAllUsers = async () => {
  const query = 'SELECT id, full_name, email, role FROM users';
  const result = await client.query(query);
  return result.rows;
};

// Delete a user (Admin operation)
const deleteUserById = async (userId) => {
  const query = 'DELETE FROM users WHERE id = $1';
  await client.query(query, [userId]);
};

// Update a user's password (Password reset)
const updatePassword = async (userId, hashedPassword) => {
  const query = 'UPDATE users SET password = $1 WHERE id = $2';
  await client.query(query, [hashedPassword, userId]);
};

module.exports = {
  registerUser,
  findUserByEmail,
  getUserById,           // Used for fetching profiles
  updateUserProfile,     // Used for updating profiles
  fetchAllUsers,
  deleteUserById,
  updatePassword         // Used for password reset
};
