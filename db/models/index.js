'use strict';

/* const <ClassName> = require('./schema/<filename>'); */
const User = require('./schema/user');
const Image = require('./schema/image');
const Datum = require('./schema/data');

/* This is where we make table relations */
User.hasMany(Image);
Image.belongsTo(User);
Image.hasMany(Datum);

module.exports = { User, Image, Datum };
