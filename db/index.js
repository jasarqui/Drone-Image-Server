const debug = require('debug')('sql');
const Sequelize = require('sequelize');
const pkg = require('../package.json');

const name = process.env.DATABASE_NAME || pkg.name;
const connectionString =
  process.env.DATABASE_URL ||
  `postgres://postgres:postgres@localhost:5432/dronedb`;

// create the database instance
const db = (module.exports = new Sequelize(connectionString, {
  logging: debug, // export DEBUG=sql in the environment to get SQL queries
  define: {
    underscored: true, // use snake_case rather than camelCase column names
    freezeTableName: true, // don't change table names from the one specified
    timestamps: true // automatically include timestamp columns
  }
}));

// pull in our models
require('./models');

// sync the db, creating it if necessary
function sync(retries = 0, maxRetries = 5) {
  return db
    .sync({ force: false })
    .then(ok => console.log(`Synced models to db ${name}`))
    .catch(fail => {
      console.log(fail);
    });
}

db.didSync = sync();
