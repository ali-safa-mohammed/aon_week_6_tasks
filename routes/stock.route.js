const express = require("express");
const router = express.Router();
const { getAvailableStock } = require("../controllers/stockController");
const clientAuth = require("../middleware/clientAuth");

// 2️⃣ GET /stock/available
//    ➤ Purpose: Return the number of “ready” cards for each plan.
//    ➤ Response Example:
//        [
//          { planId: 1, planName: "Zain 5K", available: 25 },
//          { planId: 2, planName: "Google Play 10$", available: 10 }
//        ]
router.get("/available", async (req, res) => {
  try {
    const results = await getAvailableStock();
    res.send(results);
  } catch (error) {
    res.status(500).send({ message: "problem with getting available stock" });
  }
});

module.exports = router;
