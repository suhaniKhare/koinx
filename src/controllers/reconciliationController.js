const { v4: uuidv4 } = require("uuid");

const ReconciliationRun = require("../models/ReconciliationRun");
const { ingestCSV } = require("../services/ingestionService");
const { matchTransactions } = require("../services/matchingService");

exports.reconcile = async (req, res, next) => {
  try {
    if (!req.files || !req.files.userFile || !req.files.exchangeFile) {
      return res.status(400).json({
        success: false,
        message: "Both CSV files are required",
      });
    }

    const runId = uuidv4();

    const { timestampToleranceSeconds, quantityTolerancePct } = req.body;

    await ReconciliationRun.create({
      runId,
      config: {
        timestampToleranceSeconds: timestampToleranceSeconds || 300,
        quantityTolerancePct: quantityTolerancePct || 0.01,
      },
      status: "RUNNING",
      startedAt: new Date(),
    });

    const userFilePath = req.files.userFile[0].path;
    const exchangeFilePath = req.files.exchangeFile[0].path;

    await ingestCSV(userFilePath, "USER", runId);
    await ingestCSV(exchangeFilePath, "EXCHANGE", runId);

    const reports = await matchTransactions(runId, {
      timestampToleranceSeconds: timestampToleranceSeconds || 300,
      quantityTolerancePct: quantityTolerancePct || 0.01,
    });

    await ReconciliationRun.updateOne(
      { runId },
      {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    );

    res.status(201).json({
      success: true,
      runId,
      summary: {
        matched: reports.filter((r) => r.category === "MATCHED").length,

        conflicting: reports.filter((r) => r.category === "CONFLICTING").length,

        unmatchedUser: reports.filter((r) => r.category === "UNMATCHED_USER")
          .length,

        unmatchedExchange: reports.filter(
          (r) => r.category === "UNMATCHED_EXCHANGE",
        ).length,
      },
    });
  } catch (error) {
    next(error);
  }
};
