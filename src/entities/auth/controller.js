import db from '../../../db';
import User from '../../../db/models/schema/user';
import bcrypt from 'bcrypt';

export const login = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    // SELECT username, password FROM users WHERE username = request.username;
    User.findOne({
      attributes: ['username', 'password'],
      where: {
        username: username
      }
    }).then(result => {
      /* bcrypt checks if the database password
      is a result from crypting the request password */
      bcrypt.compare(password, result.dataValues.password, (err, res) => {
        /* return if true else return error 404 */
        return res ? resolve(result.dataValues) : reject(404);
      });
    });
  });
};
