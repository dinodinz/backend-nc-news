const { fetchAllUsers } = require("../models/users");

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((allUsers) => {
      res.status(200).send({ allUsers: allUsers });
    })
    .catch((err) => {
      next(err);
    });
};
