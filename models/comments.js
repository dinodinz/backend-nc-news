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
