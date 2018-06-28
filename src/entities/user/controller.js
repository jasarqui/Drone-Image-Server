import db from '../../../db';
import User from '../../../db/models/schema/user';

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

export const signup = ({ firstname, lastname, email, username, password }) => {
  return new Promise((resolve, reject) => {
    const values = [email, username, password, firstname, lastname];
    const queryString = `
        INSERT INTO users
            (email, username, password, firstname, lastname, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, ?, now(), now())
    `;

    db.query(queryString, {
      replacements: values,
      type: db.QueryTypes.INSERT
    }).then(result => {
      return result ? resolve(200) : reject(500);
    });
  });
};
