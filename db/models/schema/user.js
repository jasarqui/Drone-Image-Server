'use strict';

/* import sequelize and the database */
const Sequelize = require('sequelize');
const db = require('../../index.js');

/* This is where we initialize the tables */
const User = db.define('users', {
  email: { type: Sequelize.STRING, allowNull: false },
  username: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
  firstname: { type: Sequelize.STRING, allowNull: false },
  lastname: { type: Sequelize.STRING, allowNull: false }
});

module.exports = User;
