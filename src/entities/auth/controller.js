import db from '../../../db';
import User from '../../../db/models/schema/user';
import bcrypt from 'bcrypt';

/* this is for loggin in a user */
export const login = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    // SELECT firstname, lastname, password, id FROM users WHERE email = request.email;
    User.findOne({
      attributes: ['firstname', 'lastname', 'password', 'id'],
      where: {
        email: email
      }
    }).then(result => {
      result
        ? /* bcrypt checks if the database password
      is a result from crypting the request password */
          bcrypt.compare(password, result.dataValues.password, (err, res) => {
            /* return if true else return error 404 */
            return res
              ? resolve({
                  firstname: result.dataValues.firstname,
                  lastname: result.dataValues.lastname,
                  id: result.dataValues.id
                })
              : reject(404);
          })
        : reject(404);
    });
  });
};
