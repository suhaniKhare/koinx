const ReportEntry = require("../models/ReportEntry");
const { Parser } = require("json2csv");

exports.getFullReport = async (req, res, next) => {
  try {
    const { runId } = req.params;

    const report = await ReportEntry.find({ runId });

    if (!report.length) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSummary = async (req, res, next) => {
  try {
    const { runId } = req.params;

    const report = await ReportEntry.find({ runId });

    if (!report.length) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const summary = {
      matched: report.filter((r) => r.category === "MATCHED").length,

      conflicting: report.filter((r) => r.category === "CONFLICTING").length,

      unmatchedUser: report.filter((r) => r.category === "UNMATCHED_USER")
        .length,

      unmatchedExchange: report.filter(
        (r) => r.category === "UNMATCHED_EXCHANGE",
      ).length,
    };

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUnmatched = async (req, res, next) => {
  try {
    const { runId } = req.params;

    const unmatched = await ReportEntry.find({
      runId,
      category: {
        $in: ["UNMATCHED_USER", "UNMATCHED_EXCHANGE"],
      },
    });

    res.json({
      success: true,
      data: unmatched,
    });
  } catch (error) {
    next(error);
  }
};

exports.exportCSV = async (req, res, next) => {
  try {
    const { runId } = req.params;

    const report = await ReportEntry.find({ runId }).lean();

    if (!report.length) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const fields = ["category", "reason", "userRow", "exchangeRow"];

    const parser = new Parser({ fields });
    const csv = parser.parse(report);

    res.header("Content-Type", "text/csv");

    res.attachment(`reconciliation-report-${runId}.csv`);

    res.send(csv);
  } catch (error) {
    next(error);
  }
};
