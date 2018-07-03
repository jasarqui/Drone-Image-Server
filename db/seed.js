const db = require('../db');
const sequelize = require('sequelize');
const bcrypt = require('bcrypt');

/* this is to hash the admin password */
const saltRounds = 10;
var adminPass = 'admin';
bcrypt.hash('admin', saltRounds, (err, hash) => {
  adminPass = hash;
});

/* this function seeds the users table */
const seedUsers = () =>
  db.Promise.map(
    [
      {
        email: 'admin@irri.org',
        password: adminPass,
        firstname: 'admin',
        lastname: 'istrator'
      }
    ],
    user => db.model('users').create(user)
  );

db.didSync
  .then(() => db.sync({ force: true }))
  .then(seedUsers)
  .then(user => console.log(`Seeded ${user.length} users`))
  .catch(error => console.error(error))
  .finally(() => db.close());
