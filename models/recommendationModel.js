const client = require('../db');

// Get recommendations based on product category and user interactions
const getRecommendations = async (userId, category) => {
  const query = `
    SELECT p.*
    FROM products p
    JOIN interactions i ON p.id = i.product_id
    WHERE p.category = $1
    GROUP BY p.id
    ORDER BY COUNT(i.id) DESC
    LIMIT 5`;
  const values = [category];

  const result = await client.query(query, values);
  return result.rows;
};

module.exports = {
  getRecommendations
};
