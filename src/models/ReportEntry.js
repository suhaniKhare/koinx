const mongoose = require("mongoose");

const reportEntrySchema = new mongoose.Schema(
  {
    runId: String,

    category: {
      type: String,
      enum: ["MATCHED", "CONFLICTING", "UNMATCHED_USER", "UNMATCHED_EXCHANGE"],
    },

    reason: String,

    userRow: mongoose.Schema.Types.Mixed,

    exchangeRow: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ReportEntry", reportEntrySchema);
