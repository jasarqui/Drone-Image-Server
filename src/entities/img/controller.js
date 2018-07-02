import db from '../../../db';
import Image from '../../../db/models/schema/image';
import Data from '../../../db/models/schema/data';

export const save = ({
  fileURL,
  name,
  camera,
  date,
  is_private,
  userId,
  attrib
}) => {
  return new Promise((resolve, reject) => {
    // INSERT INTO images (name, camera, date, filepath, private, user_id)
    // VALUES (request.name, request.camera, request.date, request.fileURL, request.is_private, request.user_id);
    Image.create({
      name: name,
      camera: camera,
      date: date,
      filepath: fileURL,
      private: is_private,
      user_id: userId ? userId : null
    }).then(result => {
      /* map the data array and use the resulting id
      from the created image entity */
      result
        ? attrib.map(datum => {
            // INSERT INTO data (name, value, image_id)
            // VALUES (datum.name, datum.value, image.id)
            Data.create({
              name: datum.name,
              value: datum.value,
              image_id: result.dataValues.id
            });
            return resolve(200);
          })
        : reject(500);
    });
  });
};
