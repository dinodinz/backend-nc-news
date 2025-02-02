const {
  fetchCommentsByArticleId,
  insertCommentToArticle,
  removeCommentById,
  editVoteByCommentId,
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

exports.deleteCommentById = (req, res, next) => {
  const params = req.params;

  removeCommentById(params)
    .then((deletedComment) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateVoteByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  editVoteByCommentId(inc_votes, comment_id)
    .then((updatedVote) => {
      res.status(200).send({ updatedVote: updatedVote });
    })
    .catch((err) => {
      next(err);
    });
};
