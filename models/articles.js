const db = require("../db/connection");
const {
  checkArticleIdExists,
  checkTopicSlugExists,
} = require("../db/seeds/utils");

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
          detail: "Article ID does not exist",
        });
      } else return result.rows[0];
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.selectAllArticles = async (queries) => {
  const { sort_by, order, topic } = queries;
  const args = [];

  const sortByValues = [
    "author",
    "title",
    "article_id",
    "topicData",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  let SQL = `SELECT articles.author,
  articles.title,
  articles.article_id,
  articles.topic,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  COUNT(comments.comment_id)::INT AS comment_count
  FROM articles LEFT JOIN comments
  ON articles.article_id = comments.article_id`;

  if (topic) {
    const checkTopic = await checkTopicSlugExists(topic)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        return Promise.reject(err);
      });

    if (checkTopic === "Topic Exists") {
      SQL += ` WHERE topic = $1 GROUP BY articles.article_id`;
      args.push(topic);
    }
  } else SQL += ` GROUP BY articles.article_id`;

  if (sort_by) {
    if (sortByValues.includes(sort_by.toLowerCase())) {
      SQL += ` ORDER BY ${sort_by}`;
    } else {
      return Promise.reject({
        status: 400,
        error: "Bad Request",
        code: "InvalidQuery",
        detail: "Invalid sort by value",
      });
    }
  }

  if (order) {
    if (order.toLowerCase() === "asc" || order.toLowerCase() === "desc") {
      if (sort_by) {
        SQL += ` ${order}`;
      } else SQL += ` ORDER BY articles.created_at ${order}`;
    } else {
      return Promise.reject({
        status: 400,
        error: "Bad Request",
        code: "InvalidQuery",
        detail: "Invalid order value",
      });
    }
  }

  if (order === undefined && sort_by === undefined) {
    SQL += ` ORDER BY articles.created_at DESC`;
  } else if (sort_by && order === undefined) {
    SQL += ` DESC`;
  }

  return db.query(SQL, args).then((result) => {
    return result.rows;
  });
};

exports.editArticleById = (reqBody, params) => {
  const { inc_votes } = reqBody;
  const { article_id } = params;
  const values = [inc_votes, article_id];

  const SQL = `UPDATE articles
      SET
        votes = votes + $1 
      WHERE article_id = $2
      RETURNING *`;

  return checkArticleIdExists(article_id).then((result) => {
    return db.query(SQL, values).then((result) => {
      return result.rows[0];
    });
  });
};
