const mongoose = require("mongoose");

const reconciliationRunSchema = new mongoose.Schema(
  {
    runId: {
      type: String,
      required: true,
      unique: true,
    },

    config: {
      timestampToleranceSeconds: {
        type: Number,
        default: 300,
      },

      quantityTolerancePct: {
        type: Number,
        default: 0.01,
      },
    },

    status: {
      type: String,
      enum: ["RUNNING", "COMPLETED", "FAILED"],
      default: "RUNNING",
    },

    startedAt: Date,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ReconciliationRun",
  reconciliationRunSchema
);