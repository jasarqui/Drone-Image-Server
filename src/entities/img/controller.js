import db from '../../../db';
import Image from '../../../db/models/schema/image';
import Data from '../../../db/models/schema/data';
import User from '../../../db/models/schema/user';
import Folder from '../../../db/models/schema/folder';
import sequelize from 'sequelize';

/* this will save the image from the client */
export const save = ({
  fileURL,
  name,
  date,
  camera,
  drone,
  image,
  location,
  is_private,
  season,
  env_cond,
  attrib,
  folder,
  userId
}) => {
  return new Promise((resolve, reject) => {
    /* find the folder's folder_id */
    Folder.findOne({
      attributes: ['id'],
      where: { name: folder }
    }).then(folder_id => {
      // INSERT INTO images (name, camera, date, filepath, private, season, user_id)
      // VALUES (request.name, request.camera, request.date, request.fileURL, request.is_private, request.season, request.user_id);
      Image.create(
        {
          name: name,
          camera: camera,
          drone: drone,
          location: location,
          image: image,
          date: date,
          env_cond: env_cond,
          season: season,
          filepath: fileURL,
          private: is_private,
          user_id: userId ? userId : null,
          data: attrib,
          folder_id: folder_id.dataValues.id
        },
        // this will also do the ff query as bulk to the attrib array:
        // INSERT INTO data (name, value, userId) VALUES (attrib.name, attrib.value, userId);
        { include: [Data] }
      ).then(result => {
        return result ? resolve(200) : reject(500);
      });
    });
  });
};

/* this will save the image from the client */
export const saveMany = ({ images }) => {
  return new Promise((resolve, reject) => {
    /* practically the same from save one, but loops the image array */
    images.map(image => {
      return Folder.findOne({
        attributes: ['id'],
        where: { name: image.folder }
      }).then(folder_id => {
        Image.create(
          {
            name: image.name,
            camera: image.camera,
            drone: image.drone,
            location: image.location,
            image: image.image,
            date: image.date,
            env_cond: image.env_cond,
            season: image.season,
            filepath: image.fileURL,
            private: image.is_private,
            user_id: image.userId ? image.userId : null,
            data: image.attrib,
            folder_id: folder_id.dataValues.id
          },
          { include: [Data] }
        ).then(result => {
          return result ? resolve(200) : reject(500);
        });
      });
    });
  });
};

/* this will get the total pages for pagination */
export const countPages = ({ category, showData, user, search, folder_id }) => {
  return new Promise((resolve, reject) => {
    /* flexible where object to reduce number of queries */
    const op = sequelize.Op;
    var whereObject = {};
    whereObject.archived = false;
    whereObject.folder_id = folder_id;

    /* adding category to whereObject */
    category === 'Dry Season'
      ? (whereObject.season = 'DRY')
      : category === 'Wet Season'
        ? (whereObject.season = 'WET')
        : whereObject;

    /* adding showData to whereObject */
    showData === 'Public Data'
      ? (whereObject.private = false)
      : showData === 'Private Data'
        ? (whereObject.private = true)
        : showData === 'Archived Data'
          ? (whereObject.archived = true)
          : whereObject;

    /* adding user to whereObject */
    user ? (whereObject.user_id = user) : whereObject;

    /* adding search to whereObject */
    search
      ? (whereObject = {
          ...whereObject,
          [op.or]: {
            name: { [op.iLike]: `%${search}%` },
            camera: { [op.iLike]: `%${search}%` },
            drone: { [op.iLike]: `%${search}%` },
            location: { [op.iLike]: `%${search}%` },
            image: { [op.iLike]: `%${search}%` },
            date: { [op.iLike]: `%${search}%` },
            env_cond: { [op.iLike]: `%${search}%` },
            season: { [op.iLike]: `%${search}%` }
          }
        })
      : whereObject;

    Image.count({
      where: whereObject
    }).then(result => {
      return result ? resolve(result) : reject(404);
    });
  });
};

/* this will get the total pages for pagination */
export const getImages = ({
  category,
  showData,
  user,
  search,
  folder_id,
  start
}) => {
  return new Promise((resolve, reject) => {
    /* flexible where object to reduce number of queries */
    const op = sequelize.Op;
    var whereObject = {};
    whereObject.archived = false;
    whereObject.folder_id = folder_id;

    /* adding category to whereObject */
    category === 'Dry Season'
      ? (whereObject.season = 'DRY')
      : category === 'Wet Season'
        ? (whereObject.season = 'WET')
        : whereObject;

    /* adding showData to whereObject */
    showData === 'Public Data'
      ? (whereObject.private = false)
      : showData === 'Private Data'
        ? (whereObject.private = true)
        : showData === 'Archived Data'
          ? (whereObject.archived = true)
          : whereObject;

    /* adding user to whereObject */
    user ? (whereObject.user_id = user) : whereObject;

    /* adding search to whereObject */
    search
      ? (whereObject = {
          ...whereObject,
          [op.or]: {
            name: { [op.iLike]: `%${search}%` },
            camera: { [op.iLike]: `%${search}%` },
            drone: { [op.iLike]: `%${search}%` },
            location: { [op.iLike]: `%${search}%` },
            image: { [op.iLike]: `%${search}%` },
            date: { [op.iLike]: `%${search}%` },
            env_cond: { [op.iLike]: `%${search}%` },
            season: { [op.iLike]: `%${search}%` }
          }
        })
      : whereObject;

    Image.findAll({
      include: [
        { model: Data, required: true },
        { model: User, attributes: ['firstname', 'lastname'] }
      ],
      where: whereObject,
      order: ['date'],
      offset: start,
      limit: 6
    }).then(result => {
      return result ? resolve(result) : reject(404);
    });
  });
};

/* archives an image */
export const archiveImage = ({ id }) => {
  return new Promise((resolve, reject) => {
    Image.update({ archived: true }, { where: { id: id } }).then(result => {
      return result ? resolve(result) : reject(500);
    });
  });
};

/* unarchives an image */
export const unarchiveImage = ({ id }) => {
  return new Promise((resolve, reject) => {
    Image.update({ archived: false }, { where: { id: id } }).then(result => {
      return result ? resolve(result) : reject(500);
    });
  });
};

/* retrieves an image */
export const getImage = id => {
  return new Promise((resolve, reject) => {
    Image.findOne({
      include: [
        { model: Data, required: true },
        { model: Folder, attributes: ['year', 'name'] },
        { model: User, attributes: ['firstname', 'lastname'] }
      ],
      where: { id: id }
    }).then(result => {
      return result ? resolve(result) : reject(404);
    });
  });
};

/* updates an image */
export const updateImage = ({
  name,
  date,
  camera,
  drone,
  image,
  location,
  is_private,
  season,
  env_cond,
  attrib,
  folder,
  id
}) => {
  return new Promise((resolve, reject) => {
    /* find the folder's folder_id */
    Folder.findOne({
      attributes: ['id'],
      where: { name: folder }
    }).then(folder_id => {
      Image.update(
        {
          name: name,
          date: date,
          camera: camera,
          drone: drone,
          image: image,
          location: location,
          private: is_private,
          season: season,
          env_cond: env_cond,
          data: attrib,
          folder_id: folder_id.dataValues.id
        },
        { where: { id: id } },
        { include: [Data] }
      ).then(result => {
        return result ? resolve(200) : reject(500);
      });
    });
  });
};
