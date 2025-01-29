const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topics");
const {
  getArticleById,
  getAllArticles,
  updateArticleById,
} = require("./controllers/articles");
const {
  getCommentsByArticleId,
  addCommentByArticleId,
} = require("./controllers/comments");
const endpoints = require("./endpoints.json");
app.use(express.json());

//GET

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/articles/:article_id", getArticleById);

//POST
app.post("/api/articles/:article_id/comments", addCommentByArticleId);

//PATCH
app.patch("/api/articles/:article_id", updateArticleById);

//middleware error handlers

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({
      error: "Bad Request",
      msg: "Invalid input syntax",
    });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503" || err.error === "Not found") {
    res.status(404).send({
      error: "Not found",
      msg: err.detail,
    });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({
      error: "Bad Request",
      msg: "Invalid request body format",
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
