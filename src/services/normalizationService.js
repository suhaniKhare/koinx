const { normalizeAsset, normalizeType } = require("../utils/aliasMapper");

exports.normalizeTransaction = (row) => {
  const errors = [];

  const normalized = {
    transactionId: row.transactionId || row.id || null,
    asset: normalizeAsset(row.asset),
    transactionType: normalizeType(row.type),
    quantity: parseFloat(row.quantity),
    timestamp: row.timestamp ? new Date(row.timestamp) : null,
  };

  if (!normalized.asset) {
    errors.push("Missing asset");
  }

  if (!normalized.transactionType) {
    errors.push("Missing type");
  }

  if (isNaN(normalized.quantity)) {
    errors.push("Invalid quantity");
  }

  if (!normalized.timestamp || isNaN(normalized.timestamp.getTime())) {
    errors.push("Invalid timestamp");
  }

  return {
    normalized,
    errors,
  };
};
