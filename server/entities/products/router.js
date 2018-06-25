const levels = '../../../';

const db = require(levels + 'db'); //this is required
const Product = require(levels + 'db/models/product');
const Review = require(levels + 'db/models/review');

const router = require('express').Router();

router.get('/', function(req, res, next) {
  Product.findAll({
    include: [Review]
  })
    .then(result => {
      res.status(200).send(result);
    })
    .catch(next);
});

router.get('/:id', function(req, res, next) {
  Product.findOne({
    where: { id: req.params.id },
    include: [Review]
  })
    .then(result => {
      res.status(200).send(result);
    })
    .catch(next);
});

module.exports = router;
