/* readability constants */
const levels = '../../../';
const schema = 'db/models/schema/';

const db = require(levels + 'db');
const User = require(levels + schema + 'user');

const login = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    User.findOne({
      attributes: ['username'],
      where: {
        username: username,
        password: password
      }
    })
      .then(result => {
        return resolve(result);
      })
      .catch(err => {
        return reject(500);
      });
  });
};

module.exports = login;
