const {
  selectArticleById,
  selectAllArticles,
  editArticleById,
} = require("../models/articles");

exports.getArticleById = (req, res, next) => {
  const params = req.params;
  selectArticleById(params)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  const queries = req.query;

  selectAllArticles(queries)
    .then((allArticles) => {
      res.status(200).send({ allArticles: allArticles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleById = (req, res, next) => {
  const reqBody = req.body;
  const params = req.params;

  editArticleById(reqBody, params)
    .then((editedArticle) => {
      res.status(200).send({ editedArticle: editedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
