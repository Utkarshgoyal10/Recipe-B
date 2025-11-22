const express = require("express");
const router = express.Router();
const { registerNGO, getNearbyNGOs } = require("../controllers/ngoController");

router.post("/register", registerNGO);
router.get("/nearby", getNearbyNGOs);

module.exports = router;
