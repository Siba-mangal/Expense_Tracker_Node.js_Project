const express = require("express");

const premiumFeatures = require("../controllers/premiumFeature");

const auth = require("../middleware/auth");

const router = express.Router();

router.get(
  "/showLeaderBoard",
  auth.authenticate,
  premiumFeatures.getUserLeaderBoard
);

module.exports = router;
