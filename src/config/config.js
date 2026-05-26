require("dotenv").config();

console.log("Mongo URI:", process.env.MONGO_URI);

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  timestampToleranceSeconds:
    Number(process.env.TIMESTAMP_TOLERANCE_SECONDS) || 300,
  quantityTolerancePct: Number(process.env.QUANTITY_TOLERANCE_PCT) || 0.01,
};
