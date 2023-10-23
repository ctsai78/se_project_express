const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const { PORT = 3001 } = process.env;
const app = express();
const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  // .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch((e) => {
    console.log("DB error", e);
  });

/* ------------------------ Remove after code review ------------------------ */
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
/* ---------------------------------------------------------------------------- */

app.use(requestLogger);
app.use(express.json());
app.use(cors());
app.use(routes);
app.use(errorLogger); // enabling the error logger
app.use(errors()); // celebrate error handler
app.use(errorHandler); //centralized error handler
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log("This is working");
});
