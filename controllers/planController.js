const db = require("../db");

const getPlans = async () => {
  const { rows } = await db.query("SELECT * FROM plan");
  return rows;
};

const getPlanById = async (palnId) => {
  const { rows } = await db.query(`SELECT * FROM plan WHERE id = ${palnId}`);
  return rows[0];
};

const purchase = async (planId, clientId) => {
  const stockResult = await db.query(
    `SELECT * FROM stock WHERE plan_id = ${planId} AND state = 'ready'`
  );
  if (stockResult.rows.length == 0) {
    return { success: false, message: "no stock" };
  }

  const clientResults = await db.query(
    `SELECT * FROM client WHERE id = ${clientId}`
  );

  if (clientResults.rows.length == 0) {
    return { success: false, message: "منيلك هاي الكلاوات" };
  }

  const planResult = await db.query(`SELECT * FROM plan WHERE id = ${planId}`);

  let user = clientResults.rows[0];
  let stock = stockResult.rows[0];
  let plan = planResult.rows[0];

  if (user.balance < parseInt(plan.price)) {
    return { success: false, message: "ماعندك فلوس، روح اشتغل وتعال" };
  }

  await db.query(`UPDATE stock SET state = 'sold' WHERE id = ${stock.id}`);
  await db.query(
    `UPDATE client SET balance = ${
      user.balance - plan.price
    } WHERE id = ${clientId}`
  );

  const result = await db.query(
    `INSERT INTO invoice (plan_id, code, client_id, price, plan_name)
    VALUES (${planId}, '${stock.code}', ${clientId}, ${plan.price}, '${plan.name}')
    RETURNING *;`
  );

  const newInvoice = result.rows[0];

  return { success: true, code: stock.code, newInvoice };
};

const getStockSummary = async (planId) => {
  const { rows } = await db.query(`
    SELECT 
      plan.id AS "planId", 
      plan.name AS "planName",
      SUM(CASE WHEN stock.state = 'ready' THEN 1 ELSE 0 END) AS ready,
      SUM(CASE WHEN stock.state = 'sold' THEN 1 ELSE 0 END) AS sold,
      SUM(CASE WHEN stock.state = 'error' THEN 1 ELSE 0 END) AS error
    FROM plan
    LEFT JOIN stock ON plan.id = stock.plan_id
    WHERE plan.id = ${planId}
    GROUP BY plan.id, plan.name
  `);
  return rows[0];
};

module.exports = {
  getPlans,
  getPlanById,
  purchase,
  getStockSummary,
};
