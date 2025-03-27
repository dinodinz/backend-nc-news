const express = require("express");
const usersRouter = express.Router();
const {
  getAllUsers,
  getUserByUsername,
  addUser,
} = require("../controllers/users");

usersRouter.route("/").get(getAllUsers).post(addUser);

usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
