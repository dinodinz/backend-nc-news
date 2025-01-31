const { fetchAllUsers, fetchUserByUsername } = require("../models/users");

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
