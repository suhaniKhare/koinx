const express = require("express");
const router = express.Router();

const upload = require("../utils/upload");

const reconciliationController = require("../controllers/reconciliationController");

router.post(
  "/reconcile",

  upload.fields([
    {
      name: "userFile",
      maxCount: 1,
    },

    {
      name: "exchangeFile",
      maxCount: 1,
    },
  ]),

  reconciliationController.reconcile,
);

module.exports = router;
