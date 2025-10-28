const express = require("express");
const router = express.Router();
const {
  getAvailableStock,
  getSoldStock,
  insertStockBatch,
} = require("../controllers/stockController");

router.get("/available", async (req, res) => {
  try {
    const results = await getAvailableStock();
    res.send(results);
  } catch (error) {
    res.status(500).send({ message: "problem with getting available stock" });
  }
});

router.get("/sold", async (req, res) => {
  try {
    const results = await getSoldStock();
    res.send(results);
  } catch (error) {
    res.status(500).send({ message: "problem with getting sold stock" });
  }
});

router.post("/batch", async (req, res) => {
  const { planId, codes } = req.body;
  try {
    const result = await insertStockBatch(planId, codes);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "problem with inserting stock batch" });
  }
});

module.exports = router;
