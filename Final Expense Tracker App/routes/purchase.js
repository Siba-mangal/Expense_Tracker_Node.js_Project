const express = require("express");
const purchaseController = require("../controllers/purchase");

const userAuthentication = require("../middleware/auth");

const router = express.Router();

router.get(
  "/premiummembership",
  userAuthentication.authenticate,
  purchaseController.purchasepremium
);
router.post(
  "/updatetransactionstatus",
  userAuthentication.authenticate,
  purchaseController.updateTransactionStatus
);
module.exports = router;
