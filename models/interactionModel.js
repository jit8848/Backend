const client = require('../db');  // PostgreSQL connection

// Add interaction (view or purchase) for a user and product
const addInteraction = async (userId, productId, interactionType) => {
  const query = `
    INSERT INTO interactions (user_id, product_id, interaction_type)
    VALUES ($1, $2, $3) RETURNING *`;
  const values = [userId, productId, interactionType];

  const result = await client.query(query, values);
  return result.rows[0];
};

module.exports = {
  addInteraction
};
