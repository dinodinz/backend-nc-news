const express = require("express");
const commentsRouter = express.Router();
const {
  deleteCommentById,
  updateVoteByCommentId,
} = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(updateVoteByCommentId);

module.exports = commentsRouter;
