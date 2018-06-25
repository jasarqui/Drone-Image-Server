const api = (module.exports = require('express').Router());

/* const <model> = require('./<modelFolder>) */
const products = require('./entities/products/router');
const reviews = require('./entities/reviews/router');

/* api.use('./<modelFolder>, <model>) */
api.use('/entities/products', products);
api.use('/entities/reviews', reviews);

// No routes matched? 404.
api.use((req, res) => res.status(404).end());
