const express = require("express");
const app = express();
const {} = require("./controllers/endpoint");
const endpoints = require("./endpoints.json");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

//middleware error handlers

app.all("*", (req, res) => {
  res.status(404).send({ error: "Endpoint not found" });
});

module.exports = app;
