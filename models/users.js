const db = require("../db/connection");

const { checkUsernameExists } = require("../db/seeds/utils");

exports.fetchAllUsers = () => {
  const SQL = `SELECT * FROM users`;

  return db.query(SQL).then((result) => {
    return result.rows;
  });
};

exports.fetchUserByUsername = (username) => {
  let SQL = `SELECT * FROM users 
  WHERE username = $1`;

  return checkUsernameExists(username).then(() => {
    return db.query(SQL, [username]).then((result) => {
      return result.rows[0];
    });
  });
};

exports.createUser = (reqBody) => {
  const { username, name, avatar_url } = reqBody;

  let SQL = `INSERT INTO users
             (username,name,avatar_url) 
             VALUES ($1,$2,$3) RETURNING*`;

  return db.query(SQL, [username, name, avatar_url]).then((result) => {
    return result.rows[0];
  });
};
