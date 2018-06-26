const db = require('../db');

const seedUsers = () =>
  db.Promise.map(
    [
      {
        email: 'admin@irri.org',
        username: 'admin',
        password: 'admin',
        firstname: 'admi',
        middlname: 'nist',
        lastname: 'rator'
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
