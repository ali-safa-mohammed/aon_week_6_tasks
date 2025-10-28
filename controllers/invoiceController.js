const db = require("../db");

const getInvoicesByClientId = async (clientId) => {
  const { rows } = await db.query(`
    SELECT * FROM invoice
    WHERE client_id = ${clientId}
    ORDER BY created_at DESC
    LIMIT 50
  `);
  return rows;
}

module.exports = {
    getInvoicesByClientId,
};


