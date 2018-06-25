const levels = '../../../';

const db = require(levels + 'db'); //this is required
const Review = require(levels + 'db/models/review');
const Product = require(levels + 'db/models/product');

const router = require('express').Router();

router.get('/', function(req, res, next) {
  Review.findAll({
    include: [Product]
  })
    .then(result => {
      res.status(200).send(result);
    })
    .catch(next);
});

router.get('/:id', function(req, res, next) {
  Review.findOne({
    where: { id: req.params.id },
    include: [Product]
  })
    .then(result => {
      res.status(200).send(result);
    })
    .catch(next);
});

module.exports = router;
