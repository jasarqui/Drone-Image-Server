import db from '../../../db';
import Image from '../../../db/models/schema/image';
import Data from '../../../db/models/schema/data';
import User from '../../../db/models/schema/user';
import sequelize from 'sequelize';

/* this will save the image from the client */
export const save = ({
  fileURL,
  name,
  camera,
  date,
  is_private,
  season,
  userId,
  attrib
}) => {
  return new Promise((resolve, reject) => {
    // INSERT INTO images (name, camera, date, filepath, private, season, user_id)
    // VALUES (request.name, request.camera, request.date, request.fileURL, request.is_private, request.season, request.user_id);
    Image.create(
      {
        name: name,
        camera: camera,
        date: date,
        filepath: fileURL,
        private: is_private,
        season: season,
        user_id: userId ? userId : null,
        data: attrib
      },
      // this will also do the ff query as bulk to the attrib array:
      // INSERT INTO data (name, value, userId) VALUES (attrib.name, attrib.value, userId);
      { include: [Data] }
    ).then(result => {
      return result ? resolve(200) : reject(500);
    });
  });
};

/* this will save the image from the client */
export const saveMany = ({ images }) => {
  return new Promise((resolve, reject) => {
    /* practically the same from save one, but loops the image array */
    images.map(image => {
      return Image.create(
        {
          name: image.name,
          camera: image.camera,
          date: image.date,
          filepath: image.fileURL,
          private: image.is_private,
          season: image.season,
          user_id: image.userId ? image.userId : null,
          data: image.attrib
        },
        { include: [Data] }
      ).then(result => {
        return result ? resolve(200) : reject(500);
      });
    });
  });
};

/* this will get the total pages for pagination */
export const countPages = ({ category, showData, user, search }) => {
  return new Promise((resolve, reject) => {
    /* flexible where object to reduce number of queries */
    var whereObject = {};

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
        : whereObject;

    /* adding user to whereObject */
    user ? (whereObject.user_id = user) : whereObject;

    /* adding search to whereObject */
    search ? (whereObject.name = search) : whereObject;

    Image.count({
      where: whereObject
    }).then(result => {
      return result ? resolve(result) : reject(404);
    });
  });
};

/* this will get the total pages for pagination */
export const getImages = ({ category, showData, user, search, start }) => {
  return new Promise((resolve, reject) => {
    /* flexible where object to reduce number of queries */
    const op = sequelize.Op;
    var whereObject = {};

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
        : whereObject;

    /* adding user to whereObject */
    user ? (whereObject.user_id = user) : whereObject;

    /* adding search to whereObject */
    search ? (whereObject.name = { [op.iLike]: `%${search}%` }) : whereObject;

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

/* this will delete an image 
export const deleteImage = ({ id }) => {
  return new Promise((resolve, reject) => {
    // DELETE FROM images WHERE id = request.id;
    Image.destroy({
      where: {
        id: id
      }
    }).then(result => {
      console.log(result);
      return result ? resolve(result) : reject(500);
    });
  });
};
*/
