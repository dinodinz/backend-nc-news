const db = require("../db/connection");

exports.fetchAllUsers = () => {
  const SQL = `SELECT * FROM users`;

  return db.query(SQL).then((result) => {
    return result.rows;
  });
};
