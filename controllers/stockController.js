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

const getSoldStock = async () => {
  const { rows } = await db.query(`
    SELECT plan.id AS "planId", plan.name AS "planName", COUNT(stock.id) AS sold
    FROM plan
    JOIN stock ON plan.id = stock.plan_id AND stock.state = 'sold'
    GROUP BY plan.id, plan.name
  `);
  return rows;
};

const insertStockBatch = async (planId, codes) => {
  const values = codes
    .map((code) => `(${planId}, '${code}', 'ready')`)
    .join(", ");
  const result = await db.query(`
    INSERT INTO stock (plan_id, code, state)
    VALUES ${values}
    RETURNING *;
  `);
  return { inserted: result.rows.length };
};

module.exports = {
  getAvailableStock,
  getSoldStock,
  insertStockBatch,
};
