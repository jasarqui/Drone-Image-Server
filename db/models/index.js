'use strict';

/* const <ClassName> = require('./schema/<filename>'); */
const User = require('./schema/user');
const Image = require('./schema/image');

/* This is where we make table relations */
User.hasMany(Image);
Image.belongsTo(User);

module.exports = { User, Image };
