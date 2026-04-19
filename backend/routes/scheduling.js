const express = require("express");
const router = express.Router();
const { simulate, compare } = require("../controllers/schedulingController");

// Single algorithm simulation
router.post("/simulate", simulate);

// Compare all algorithms side-by-side
router.post("/compare", compare);

module.exports = router;
