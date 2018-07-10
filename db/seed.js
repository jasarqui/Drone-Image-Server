const db = require('../db');

/* this will restart our database */
db.didSync
  .then(() => db.sync({ force: true }))
  .catch(error => console.error(error))
  .finally(() => db.close());
