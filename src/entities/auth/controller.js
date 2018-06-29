import db from '../../../db';
import User from '../../../db/models/schema/user';
import bcrypt from 'bcrypt';

export const login = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    User.findOne({
      attributes: ['username', 'password'],
      where: {
        username: username
      }
    }).then(result => {
      bcrypt.compare(password, result.dataValues.password, (err, res) => {
        return res ? resolve(result.dataValues) : reject(404);
      });
    });
  });
};
