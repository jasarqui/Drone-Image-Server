import db from '../../../db';
import User from '../../../db/models/schema/user';

export const login = ({ username, password }) => {
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
