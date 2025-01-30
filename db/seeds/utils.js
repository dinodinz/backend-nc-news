const db = require("../connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkArticleIdExists = (article_id) => {
  let SQL = `SELECT * FROM articles 
  WHERE article_id = $1`;

  return db.query(SQL, [article_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        error: "Not found",
        detail: "Article ID does not exist",
      });
    } else return "Category Exists";
  });
};

exports.checkCommentIdExists = (comment_id) => {
  let SQL = `SELECT * FROM comments 
  WHERE comment_id = $1`;

  return db.query(SQL, [comment_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        error: "Not found",
        detail: "Comment ID does not exist",
      });
    } else return "Comment Exists";
  });
};

exports.checkTopicSlugExists = (topicSlug) => {
  let SQL = `SELECT * FROM topics 
  WHERE slug = $1`;

  return db
    .query(SQL, [topicSlug])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          error: "Not found",
          detail: "Topic does not exist",
        });
      } else return "Topic Exists";
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
