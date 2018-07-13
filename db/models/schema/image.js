'use strict';

/* import sequelize and the database */
const Sequelize = require('sequelize');
const db = require('../../index.js');

/* This is where we initialize the tables */
const Image = db.define('images', {
  name: { type: Sequelize.STRING, allowNull: false },
  camera: { type: Sequelize.STRING, allowNull: false },
  date: { type: Sequelize.STRING, allowNull: false },
  filepath: { type: Sequelize.STRING, allowNull: false },
  private: { type: Sequelize.BOOLEAN, allowNull: false },
  season: { type: Sequelize.STRING, allowNull: false },
  archived: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
});

module.exports = Image;
