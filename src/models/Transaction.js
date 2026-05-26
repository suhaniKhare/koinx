const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  runId: String,

  source: {
    type: String,
    enum: ["USER", "EXCHANGE"],
  },

  originalRow: mongoose.Schema.Types.Mixed,

  normalized: mongoose.Schema.Types.Mixed,

  status: {
    type: String,
    enum: ["VALID", "INVALID"],
  },

  validationErrors: [String],
});

module.exports = mongoose.model("Transaction", transactionSchema);
