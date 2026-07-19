const express = require("express");
const router = express.Router();
const { getRecommendationAnalytics } = require("../controllers/analyticsController");

router.get("/recommendations", getRecommendationAnalytics);

module.exports = router;
