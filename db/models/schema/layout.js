'use strict';

/* import sequelize and the database */
const Sequelize = require('sequelize');
const db = require('../../index.js');

/* This is where we initialize the tables */
const Layout = db.define('layouts', {
  name: { type: Sequelize.STRING, allowNull: false },
  link: { type: Sequelize.STRING, allowNull: false }
});

module.exports = Layout;
