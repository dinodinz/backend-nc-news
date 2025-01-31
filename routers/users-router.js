const express = require("express");
const usersRouter = express.Router();
const { getAllUsers } = require("../controllers/users");

usersRouter.get("/", getAllUsers);

module.exports = usersRouter;
