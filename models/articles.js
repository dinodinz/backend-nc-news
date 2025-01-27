const db = require("../db/connection");

exports.selectArticleById = (params) => {
  let { article_id } = params;
  let SQL = `SELECT * FROM articles`;
  let values = [];

  if (article_id) {
    SQL += ` WHERE article_id = $1`;
    values.push(article_id);
  }

  return db
    .query(SQL, values)
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          error: "Not found",
          msg: "Article ID does not exist",
        });
      } else return result.rows[0];
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
