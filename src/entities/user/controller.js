import db from '../../../db';
import User from '../../../db/models/schema/user';
import bcrypt from 'bcrypt';

export const getUser = ({ username }) => {
  return new Promise((resolve, reject) => {
    User.findOne({
      attributes: ['username'],
      where: {
        username: username
      }
    }).then(result => {
      return result ? resolve(result.dataValues) : resolve(null);
    });
  });
};

export const getEmail = ({ email }) => {
  return new Promise((resolve, reject) => {
    User.findOne({
      attributes: ['username'],
      where: {
        email: email
      }
    }).then(result => {
      return result ? resolve(result.dataValues) : resolve(null);
    });
  });
};

export const signup = ({ firstname, lastname, email, username, password }) => {
  return new Promise((resolve, reject) => {
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, (err, hash) => {
      User.create({
        email: email,
        username: username,
        password: hash,
        firstname: firstname,
        lastname: lastname
      }).then(result => {
        return result ? resolve(200) : reject(500);
      });
    });
  });
};
