const { selectAllTopics } = require("../models/topics");

exports.getAllTopics = (req, res, next) => {
  const query = req.query;

  selectAllTopics()
    .then((allTopics) => {
      if (Object.keys(query).length === 0) {
        res.status(200).send({ allTopics: allTopics });
      } else {
        res.status(200).send({
          warning: "This endpoint does not support queries",
          allTopics: allTopics,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};
