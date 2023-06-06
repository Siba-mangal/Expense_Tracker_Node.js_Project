const express = require("express");
const path = require("path");
const forgot = require("../controllers/forgotPassword");

const router = express.Router();

router.use("/forgotPassword", forgot.forgotPassword);
// router.post("/changePassword", forgot.changePassword);
router.get("/resetPassword/:id", forgot.resetPassword);
router.get("/updatePassword/:id", forgot.updatePassword);
module.exports = router;
