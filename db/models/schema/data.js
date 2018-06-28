'use strict';

/* import sequelize and the database */
const Sequelize = require('sequelize');
const db = require('../../index.js');

/* This is where we initialize the tables */
const Datum = db.define('data', {
  name: { type: Sequelize.STRING, allowNull: false },
  value: { type: Sequelize.STRING, allowNull: false },
  type: { type: Sequelize.STRING, allowNull: false } // values are: metadata, attrib
});

module.exports = Datum;
