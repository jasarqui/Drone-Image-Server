'use strict';

/* const <ClassName> = require('./schema/<filename>'); */
const User = require('./schema/user');
const Image = require('./schema/image');
const Datum = require('./schema/data');
const Folder = require('./schema/folder');
const Layout = require('./schema/layout');

/* This is where we make table relations */
// user to image relation
User.hasMany(Image);
Image.belongsTo(User);
// image to data relation
Image.hasMany(Datum);
Datum.belongsTo(Image);
// folder to image relation
Folder.hasMany(Image);
Image.belongsTo(Folder);
// folder to layout relation
Folder.hasMany(Layout);
Layout.belongsTo(Folder);

module.exports = { User, Image, Datum, Folder, Layout };
