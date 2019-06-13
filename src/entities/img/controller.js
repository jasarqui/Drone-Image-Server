import db from "../../../db";
import Image from "../../../db/models/schema/image";
import Data from "../../../db/models/schema/data";
import User from "../../../db/models/schema/user";
import Folder from "../../../db/models/schema/folder";
import sequelize from "sequelize";
import fs from "fs";
const util = require("util");
const exec = util.promisify(require("child_process").exec);
var request = require('request').defaults({ encoding: null });
var cloudinary = require("cloudinary").v2;

/* create constants here */
const CLOUDINARY_UPLOAD_CLOUD = "jasarqui";
const CLOUDINARY_UPLOAD_KEY = "962934974613628";
const CLOUDINARY_UPLOAD_SECRET = "P-rVSjFKEV2j_pKP9qJkQjasFaQ";

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
      attributes: ["id"],
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
        attributes: ["id"],
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

/* this will call the python script to run the analysis code */
export const analyzeImage = async ({ file }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dir = "src/entities/img/utils/";

      // decode url to uri
      var data = "";
      await request.get(file.file, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
        } else {
          console.log(error);
        }
      });

      // write data to file
      await fs.writeFile(dir + "analyze_data.txt", data, err => {
        if (err) {
          console.log(err);
        }
      });

      // execute analysis script
      const {stdout} = await exec(dir + "analyze.py");
      
      // get the data from analysis
      let payload = null;
      await fs.readFile(dir + 'rice_data.txt', async (err, data) => {
        if (err) console.log(err);
        
        let split_data = await data.toString('utf8').split('\n');
        payload = {yield: split_data[0], days: split_data[1]};
      });
      
      // delete file
      await exec("rm src/entities/img/utils/analyze_data.txt");
      await exec("rm src/entities/img/utils/rice_data.txt");

      resolve(payload);
    } catch(err) {
      console.log(err);
      reject(500);
    }
  });
};

/* this will call the python script to run the segmentation code */
export const segmentImage = async ({ file }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dir = "src/entities/img/utils/";

      // write data uri to file
      await fs.writeFile(dir + "data.txt", file.file, err => {
        if (err) {
          console.log(err);
        }
      });
      // execute segmentation script
      await exec(dir + "segment.py");
      // delete file
      await exec("rm src/entities/img/utils/data.txt");

      // get all the fields segmented
      await fs.readdir(dir, async (err, list) => {
        if (err) {
          console.log(err);
        }

        // filter using regex
        var field_images = [];
        var regex = new RegExp("field.*");
        list.forEach(file => {
          if (regex.test(file)) field_images.push(file);
        });

        var images = field_images.map(async image => new Promise((resolve, reject) => {
            /* this is to post to the cloudinary api,
              so that the image is uploaded to the cloud */

            cloudinary.uploader.upload(
              dir + image,
              {
                cloud_name: CLOUDINARY_UPLOAD_CLOUD,
                api_key: CLOUDINARY_UPLOAD_KEY,
                api_secret: CLOUDINARY_UPLOAD_SECRET,
                timeout: 3600000
              },
              function(err, result) {
                if (err) {console.log(err), reject(500);}
                // add response link to payload
                resolve({name: result.original_filename, link: result.secure_url});
              }
            );
        }))
        
        var payload = null;
        await Promise.all(images).then(function(values) {
          // delete files
          field_images.forEach(image => {
            exec("rm src/entities/img/utils/" + image);
          }); 
          
          resolve(values);
          payload = values;
        }).catch(error => console.log(error));

        resolve(payload);
      });
    } catch(err) {
      reject(500);
    }
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
    category === "Dry Season"
      ? (whereObject.season = "DRY")
      : category === "Wet Season"
      ? (whereObject.season = "WET")
      : whereObject;

    /* adding showData to whereObject */
    showData === "Public Data"
      ? (whereObject.private = false)
      : showData === "Private Data"
      ? (whereObject.private = true)
      : showData === "Archived Data"
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

/* this will get all images in the folder for the report */
export const getAllImages = ({id}) => {
  return new Promise((resolve, reject) => {
    Image.findAll({
      include: [
        { model: Data, required: false },
      ],
      where: {folder_id: id}
    }).then(result => {
      return result ? resolve(result) : reject(404)
    })
  })
}

/* this will get the searched images in folder */
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
    category === "Dry Season"
      ? (whereObject.season = "DRY")
      : category === "Wet Season"
      ? (whereObject.season = "WET")
      : whereObject;

    /* adding showData to whereObject */
    showData === "Public Data"
      ? (whereObject.private = false)
      : showData === "Private Data"
      ? (whereObject.private = true)
      : showData === "Archived Data"
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
        { model: User, attributes: ["firstname", "lastname"] }
      ],
      where: whereObject,
      order: ["date"],
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
        { model: Data, required: false },
        { model: Folder, attributes: ["year", "name"] },
        { model: User, attributes: ["firstname", "lastname"] }
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
      attributes: ["id"],
      where: { name: folder }
    }).then(folder_id => {
      // delete existing data for the image
      Data.destroy({
        where: { image_id: id }
      })
      // then create a new one, LOL
      attrib.map(attr => {
        attr = {...attr, image_id: id};
        Data.create(attr)
      })

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
          folder_id: folder_id.dataValues.id
        },
        { where: { id: id } }
      ).then(result => {
        return result ? resolve(200) : reject(500);
      });
    });
  });
};
