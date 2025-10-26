const db = require("../db");

const getAvailableStock = async () => {
  const { rows } = await db.query(`
    SELECT plan.id AS "planId", plan.name AS "planName", COUNT(stock.id) AS available
    FROM plan
    JOIN stock ON plan.id = stock.plan_id AND stock.state = 'ready'
    GROUP BY plan.id, plan.name
  `);
  return rows;
};

module.exports = {
  getAvailableStock,
};
