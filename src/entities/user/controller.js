import db from '../../../db';
import User from '../../../db/models/schema/user';
import bcrypt from 'bcrypt';

/* this gets a user using an email to check if exists */
export const getEmail = ({ email }) => {
  return new Promise((resolve, reject) => {
    // SELECT email FROM users WHERE email = request.email;
    User.findOne({
      attributes: ['email'],
      where: {
        email: email
      }
    }).then(result => {
      return result ? resolve(result.dataValues) : resolve(null);
    });
  });
};

/* this creates a new user in the database */
export const signup = ({ firstname, lastname, email, password, pic }) => {
  return new Promise((resolve, reject) => {
    const saltRounds = 10;

    /* hash the password first, will be stored in the hash variable */
    bcrypt.hash(password, saltRounds, (err, hash) => {
      // INSERT INTO users (email, password, firstname, lastname)
      // VALUES (request.email, hash, request.firstname, request.lastname);
      User.create({
        email: email,
        password: hash,
        firstname: firstname,
        lastname: lastname,
        pic: pic
      }).then(result => {
        return result ? resolve(200) : reject(500);
      });
    });
  });
};
