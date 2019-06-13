'use strict';

/* import sequelize and the database */
const Sequelize = require('sequelize');
const db = require('../../index.js');

/* This is where we initialize the tables */
const Folder = db.define('folders', {
  name: { type: Sequelize.STRING, allowNull: false, unique: true },
  season: { type: Sequelize.STRING, allowNull: false },
  year: { type: Sequelize.STRING, allowNull: false },
  report: { type: Sequelize.STRING, allowNull: true }
});

module.exports = Folder;
