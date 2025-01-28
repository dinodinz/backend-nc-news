const { selectArticleById, selectAllArticles } = require("../models/articles");

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
  selectAllArticles()
    .then((allArticles) => {
      res.status(200).send({ allArticles: allArticles });
    })
    .catch((err) => {
      next(err);
    });
};
