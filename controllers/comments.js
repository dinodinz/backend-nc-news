const { fetchCommentsByArticleId } = require("../models/comments");

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
