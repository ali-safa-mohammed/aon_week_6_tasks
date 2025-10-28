const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getClientBalance,
  topUpClientBalance,
} = require("../controllers/clientController");

router.post("/register", async (req, res) => {
  try {
    const body = req.body;
    const isSaved = await register(body);
    if (!isSaved) {
      return res.status(501).send({ message: "اكو مشكله بالدنيا..." });
    }
    res.send({ message: "Register succefully." });
  } catch (error) {
    res.status(500).send({ message: "اكو مشكله بالدنيا..." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const body = req.body;
    const result = await login(body.phone, body.password);
    if (!result.success) {
      return res.status(501).send({ message: result.message });
    }
    res.send({ token: result.token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "اكو مشكله بالدنيا..." });
  }
});

router.get("/:id/balance", async (req, res) => {
  try {
    const clientId = req.params.id;
    const clientBalance = await getClientBalance(clientId);
    res.send(clientBalance);
  } catch (error) {
    res.status(500).send({ message: "problom geting balance" });
  }
});

router.post("/:id/topup", async (req, res) => {
  try {
    const clientId = req.params.id;
    const amount = req.body.amount;

    const client = await getClientBalance(clientId);
    const oldBalance = client.balance;

    await topUpClientBalance(clientId, amount);

    const updatedClient = await getClientBalance(clientId);
    const newBalance = updatedClient.balance;

    res.send({ id: clientId, oldBalance, newBalance });
  } catch (error) {
    res.status(500).send({ message: "problem with topping up balance" });
  }
});
module.exports = router;
