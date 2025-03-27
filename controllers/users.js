const {
  fetchAllUsers,
  fetchUserByUsername,
  createUser,
} = require("../models/users");

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((allUsers) => {
      res.status(200).send({ allUsers: allUsers });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addUser = (req, res, next) => {
  const reqBody = req.body;
  createUser(reqBody)
    .then((createdUser) => {
      res.status(201).send({ createdUser: createdUser });
    })
    .catch((err) => {
      next(err);
    });
};
