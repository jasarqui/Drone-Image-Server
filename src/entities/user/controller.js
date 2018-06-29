import db from '../../../db';
import User from '../../../db/models/schema/user';
import bcrypt from 'bcrypt';

export const getUser = ({ username }) => {
  return new Promise((resolve, reject) => {
    // SELECT username FROM users WHERE username = request.username;
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
    // SELECT username FROM users WHERE email = request.email;
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

    /* hash the password first, will be stored in the hash variable */
    bcrypt.hash(password, saltRounds, (err, hash) => {
      // INSERT INTO users (email, username, password, firstname, lastname)
      // VALUES (request.email, request.userame, hash, request.firstname, request.lastname);
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
