const express = require("express");
const mongoose = require("mongoose");

const config = require("./src/config/config");
const reconciliationRoutes = require("./src/routes/reconciliationRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

app.use(express.json());

app.use("/api", reconciliationRoutes);
app.use("/api", reportRoutes);

app.use(errorHandler);

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT || config.port, () => {
      console.log(`Server running on port ${process.env.PORT || config.port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
