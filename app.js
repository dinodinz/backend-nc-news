const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topics");
const { getArticleById } = require("./controllers/articles");
const endpoints = require("./endpoints.json");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

//middleware error handlers

app.use((err, req, res, next) => {
  if (err.error === "Not found") {
    res.status(404).send({ error: err.error, msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res
      .status(400)
      .send({
        error: "Bad Request",
        msg: "Invalid input syntax for Article ID",
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
