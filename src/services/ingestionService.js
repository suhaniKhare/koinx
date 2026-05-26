const fs = require("fs");
const csv = require("csv-parser");

const Transaction = require("../models/Transaction");
const { normalizeTransaction } = require("./normalizationService");

exports.ingestCSV = (filePath, source, runId) => {
  return new Promise((resolve, reject) => {
    const transactions = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const { normalized, errors } = normalizeTransaction(row);

        transactions.push({
          runId,
          source,
          originalRow: row,

          normalized,

          status: errors.length > 0 ? "INVALID" : "VALID",

          validationErrors: errors,
        });
      })

      .on("end", async () => {
        try {
          const saved = await Transaction.insertMany(transactions);

          resolve(saved);
        } catch (err) {
          reject(err);
        }
      })

      .on("error", reject);
  });
};
