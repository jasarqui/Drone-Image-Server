'use strict';

/* import sequelize and the database */
const Sequelize = require('sequelize');
const db = require('../../index.js');

/* This is where we initialize the tables */
const Image = db.define('images', {
  name: { type: Sequelize.STRING, allowNull: false },
  filepath: { type: Sequelize.STRING, allowNull: false },
  private: { type: Sequelize.BOOLEAN, allowNull: false }
});

module.exports = Image;
