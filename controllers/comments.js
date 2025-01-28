const {
  fetchCommentsByArticleId,
  insertCommentToArticle,
} = require("../models/comments");

exports.getCommentsByArticleId = (req, res, next) => {
  const params = req.params;
  fetchCommentsByArticleId(params)
    .then((allComments) => {
      res.status(200).send({ allComments: allComments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addCommentByArticleId = (req, res, next) => {
  const requestBody = req.body;
  const params = req.params;

  insertCommentToArticle(requestBody, params)
    .then((postedComment) => {
      res.status(201).send({ postedComment: postedComment });
    })
    .catch((err) => {
      next(err);
    });
};
