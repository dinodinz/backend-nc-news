const db = require("../db/connection");
const {
  checkArticleIdExists,
  checkCommentIdExists,
} = require("../db/seeds/utils");

exports.fetchCommentsByArticleId = (params) => {
  let { article_id } = params;
  let SQL = `SELECT * FROM comments 
      WHERE article_id = $1 
      ORDER BY created_at DESC`;

  return checkArticleIdExists(article_id).then((result) => {
    return db.query(SQL, [article_id]).then((result) => {
      return result.rows;
    });
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

exports.removeCommentById = (params) => {
  const { comment_id } = params;
  const SQL = `DELETE FROM comments
               WHERE comment_id = $1
               RETURNING *`;

  return checkCommentIdExists(comment_id).then(() => {
    return db.query(SQL, [comment_id]).then((result) => {
      return result.rows[0];
    });
  });
};

exports.editVoteByCommentId = (updateVote, update, comment_id) => {
  const args = [updateVote, comment_id];
  const SQL = `UPDATE comments
    SET
    votes = $1
    WHERE comment_id = $2  
    RETURNING *`;

  return checkCommentIdExists(comment_id).then(() => {
    return db.query(SQL, args).then((result) => {
      return result.rows[0];
    });
  });
};
