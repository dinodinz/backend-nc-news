const db = require("../db/connection");
const {
  checkArticleIdExists,
  checkTopicSlugExists,
  checkUsernameExists,
} = require("../db/seeds/utils");

exports.selectArticleById = async (params) => {
  let { article_id } = params;
  let SQL = `SELECT articles.*,COUNT(comment_id)::INT AS comment_count 
             FROM articles LEFT JOIN comments 
             ON articles.article_id = comments.article_id
             WHERE articles.article_id = $1 GROUP BY articles.article_id`;

  await checkArticleIdExists(article_id).catch((err) => {
    return Promise.reject(err);
  });

  return db
    .query(SQL, [article_id])
    .then((result) => {
      return result.rows[0];
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

exports.insertNewArticle = async (reqBody) => {
  const { author, title, body, topic, article_img_url } = reqBody;

  const values = [author, title, body, topic];

  let SQL = `INSERT INTO articles
               (author,title,body,topic`;

  if (
    (await checkTopicSlugExists(topic)) === "Topic Exists" &&
    (await checkUsernameExists(author)) === "Username Exists"
  ) {
    if (article_img_url) {
      SQL += `,article_img_url)
            VALUES
            ($1,$2,$3,$4,$5) RETURNING*`;
      values.push(article_img_url);
    } else {
      SQL += `)
            VALUES
            ($1,$2,$3,$4) RETURNING*`;
    }
  }

  return db.query(SQL, values).then((result) => {
    return result.rows[0];
  });
};
