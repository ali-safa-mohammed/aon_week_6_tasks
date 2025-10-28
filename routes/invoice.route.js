const express = require("express");
const router = express.Router();
const { getInvoicesByClientId } = require("../controllers/invoiceController");

router.get("/client/:id", async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    const results = await getInvoicesByClientId(clientId);
    res.send(results);
  } catch (error) {
    res.status(500).send({ message: "problem with getting invoices" });
  }
});

module.exports = router;
