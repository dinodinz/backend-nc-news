const { request } = require("../app");
const db = require("../db/connection");

exports.fetchCommentsByArticleId = (params) => {
  let { article_id } = params;
  let SQL = `SELECT * FROM comments 
      WHERE article_id = $1 
      ORDER BY created_at DESC`;

  return db.query(SQL, [article_id]).then((result) => {
    return result.rows;
  });
};

exports.insertCommentToArticle = (requestBody, params) => {
  const { article_id } = params;
  const values = [requestBody.body, article_id, requestBody.username];
  const SQL = `INSERT INTO comments (body,article_id,author) VALUES ($1,$2,$3) RETURNING *`;

  return db.query(SQL, values).then((result) => {
    return result.rows[0].body;
  });
};
