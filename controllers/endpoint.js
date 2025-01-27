const { selectEndpoints } = require("../models/endpoint");

exports.getEndpoint = (req, res, next) => {
  selectEndpoints()
    .then((endpointData) => {
      console.log(endpointData);
      res.status(200).send({ endpointData: endpointData });
    })
    .catch((err) => {
      next(err);
    });
};
