const express = require("express");
const articlesRouter = express.Router();
const {
  getArticleById,
  getAllArticles,
  updateArticleById,
} = require("../controllers/articles");
const {
  getCommentsByArticleId,
  addCommentByArticleId,
} = require("../controllers/comments");

articlesRouter.get("/", getAllArticles);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(addCommentByArticleId);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById);

module.exports = articlesRouter;
