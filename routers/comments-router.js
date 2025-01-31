const express = require("express");
const commentsRouter = express.Router();
const { deleteCommentById } = require("../controllers/comments");

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
