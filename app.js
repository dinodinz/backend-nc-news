const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topics");
const endpoints = require("./endpoints.json");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics);

//middleware error handlers

app.all("*", (req, res) => {
  res.status(404).send({ error: "Endpoint not found" });
});

module.exports = app;
