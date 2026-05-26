const Transaction = require("../models/Transaction");
const ReportEntry = require("../models/ReportEntry");

const {
  isWithinTimestampTolerance,
  isWithinQuantityTolerance,
} = require("../utils/tolerance");

exports.matchTransactions = async (runId, config) => {
  const userTransactions = await Transaction.find({
    runId,
    source: "USER",
    status: "VALID",
  });

  const exchangeTransactions = await Transaction.find({
    runId,
    source: "EXCHANGE",
    status: "VALID",
  });

  const usedExchangeIds = new Set();

  const reports = [];

  for (const userTx of userTransactions) {
    let matched = false;

    for (const exchangeTx of exchangeTransactions) {
      if (usedExchangeIds.has(exchangeTx._id.toString())) {
        continue;
      }

      if (userTx.normalized.asset !== exchangeTx.normalized.asset) {
        continue;
      }

      if (
        userTx.normalized.transactionType !==
        exchangeTx.normalized.transactionType
      ) {
        continue;
      }

      const timestampMatch = isWithinTimestampTolerance(
        userTx.normalized.timestamp,
        exchangeTx.normalized.timestamp,
        config.timestampToleranceSeconds,
      );

      const quantityMatch = isWithinQuantityTolerance(
        userTx.normalized.quantity,
        exchangeTx.normalized.quantity,
        config.quantityTolerancePct,
      );

      if (timestampMatch && quantityMatch) {
        reports.push({
          runId,
          category: "MATCHED",
          reason: "Matched within tolerance",
          userRow: userTx.originalRow,
          exchangeRow: exchangeTx.originalRow,
        });

        usedExchangeIds.add(exchangeTx._id.toString());

        matched = true;
        break;
      }

      if (timestampMatch || quantityMatch) {
        reports.push({
          runId,
          category: "CONFLICTING",
          reason: "Partial match but fields differ",
          userRow: userTx.originalRow,
          exchangeRow: exchangeTx.originalRow,
        });

        usedExchangeIds.add(exchangeTx._id.toString());

        matched = true;
        break;
      }
    }

    if (!matched) {
      reports.push({
        runId,
        category: "UNMATCHED_USER",
        reason: "No matching exchange transaction found",
        userRow: userTx.originalRow,
      });
    }
  }

  for (const exchangeTx of exchangeTransactions) {
    if (!usedExchangeIds.has(exchangeTx._id.toString())) {
      reports.push({
        runId,
        category: "UNMATCHED_EXCHANGE",
        reason: "No matching user transaction found",
        exchangeRow: exchangeTx.originalRow,
      });
    }
  }

  await ReportEntry.insertMany(reports);

  return reports;
};
