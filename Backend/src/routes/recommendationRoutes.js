const express = require("express");
const router = express.Router();

const {
  getRecommendations,
  explainRecommendation,
  acceptRecommendation
} = require("../controllers/recommendationController");

router.get("/:userId", getRecommendations);
router.post("/explain", explainRecommendation);
router.post("/accept", acceptRecommendation);

module.exports = router;