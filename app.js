const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");

app.use(express.json());

app.use("/api", apiRouter);

//middleware error handlers

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({
      error: "Bad Request: Invalid input syntax",
    });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503" || err.error === "Not found") {
    res.status(404).send({
      error: `Not found: ${err.detail}`,
    });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "InvalidQuery") {
    res.status(400).send({
      error: `Bad Request: ${err.detail}`,
    });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({
      error: "Bad Request: Invalid request body format",
    });
  } else next(err);
});

app.all("*", (req, res) => {
  res.status(404).send({ error: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: "Internal Server Error" });
});

module.exports = app;
