const { selectArticleById } = require("../models/articles");

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
