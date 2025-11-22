const express = require("express");
const router = express.Router();
const { registerDonor } = require("../controllers/donorController");

router.post("/register", registerDonor);

module.exports = router;
