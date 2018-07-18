'use strict';

/* const <ClassName> = require('./schema/<filename>'); */
const User = require('./schema/user');
const Image = require('./schema/image');
const Datum = require('./schema/data');
const Folder = require('./schema/folder');

/* This is where we make table relations */
User.hasMany(Image);
Image.belongsTo(User);
Image.hasMany(Datum);
Folder.hasMany(Image);

module.exports = { User, Image, Datum, Folder };
