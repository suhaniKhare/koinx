const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");

router.get("/report/:runId", reportController.getFullReport);

router.get("/report/:runId/summary", reportController.getSummary);

router.get("/report/:runId/unmatched", reportController.getUnmatched);
router.get("/report/:runId/export", reportController.exportCSV);

module.exports = router;
