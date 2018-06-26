const api = (module.exports = require('express').Router());

/* const <model> = require('./<modelFolder>) */
const authRouter = require('./entities/auth/router');

/* api.use('<model>) */
api.use(authRouter);

// No routes matched? 404.
api.use((req, res) => res.status(404).end());
