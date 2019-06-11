import db from "../../../db";
import Folder from "../../../db/models/schema/folder";
import Image from "../../../db/models/schema/image";
import Layout from "../../../db/models/schema/layout";
import sequelize from "sequelize";

/* this creates a new user in the database */
export const addFolder = ({ season, date, report, layout }) => {
  return new Promise((resolve, reject) => {
    // INSERT INTO users (email, password, firstname, lastname)
    // VALUES (request.email, hash, request.firstname, request.lastname);
    Folder.create(
      {
        name: (season === "WET" ? "WS" : "DS") + date,
        season: season,
        year: date,
        report: report,
        layout: layout
      },
      { include: [Layout] }
    )
      .then(result => {
        return result ? resolve(200) : reject(500);
      })
      .catch(() => {
        return reject(400);
      });
  });
};

/* this will get the total pages for pagination */
export const countFolderPages = ({ category, showData, user, search }) => {
  return new Promise((resolve, reject) => {
    /* flexible where object to reduce number of queries */
    const op = sequelize.Op;
    var whereObject = {};

    /* adding category to whereObject */
    category === "Dry Season"
      ? (whereObject = { ...whereObject, season: "DRY" })
      : category === "Wet Season"
      ? (whereObject = { ...whereObject, season: "WET" })
      : whereObject;

    /* adding search to whereObject */
    search
      ? (whereObject = {
          ...whereObject,
          [op.or]: {
            name: { [op.iLike]: `%${search}%` },
            season: { [op.iLike]: `%${search}%` },
            year: { [op.iLike]: `%${search}%` }
          }
        })
      : whereObject;

    Folder.count({
      where: whereObject
    }).then(result => {
      return result ? resolve(result) : reject(404);
    });
  });
};

/* this will get the folders for pagination */
export const getFolders = ({ category, search, start }) => {
  return new Promise((resolve, reject) => {
    /* flexible where object to reduce number of queries */
    const op = sequelize.Op;
    var whereObject = {};

    /* adding category to whereObject */
    category === "Dry Season"
      ? (whereObject = { ...whereObject, season: "DRY" })
      : category === "Wet Season"
      ? (whereObject = { ...whereObject, season: "WET" })
      : whereObject;

    /* adding search to whereObject */
    search
      ? (whereObject = {
          ...whereObject,
          [op.or]: {
            name: { [op.iLike]: `%${search}%` },
            season: { [op.iLike]: `%${search}%` },
            year: { [op.iLike]: `%${search}%` }
          }
        })
      : whereObject;

    Folder.findAll({
      include: {
        model: Image,
        attributes: ["id"]
      },
      group: "folders.id",
      where: whereObject,
      order: ["year"],
      offset: start,
      limit: 10
    }).then(result => {
      return result ? resolve(result) : reject(404);
    });
  });
};

/* this will get all folders */
export const getAllFolders = () => {
  return new Promise((resolve, reject) => {
    Folder.findAll({
      attributes: ["name"]
    }).then(result => {
      return result ? resolve(result) : reject(404);
    });
  });
};

/* this will get a folder */
export const getFolder = id => {
  return new Promise((resolve, reject) => {
    var payload = null;
    Folder.findOne({ where: { id: id } }).then(result => {
      payload = result.dataValues;
      Layout.findAll(
        { attributes: ["name", "preview"] },
        { where: { folder_id: id } }
      )
        .then(res => {
          payload.layout = res;
        })
        .then(() => {
          return payload ? resolve(payload) : reject(404);
        });
    });
  });
};

/* updates a folder */
export const editFolder = ({ season, date, layout, report, id }) => {
  return new Promise((resolve, reject) => {
    // delete layouts concerned to folder
    Layout.destroy({ where: { folder_id: id } });
    // then create them again
    layout.map(file => {
      file = { ...file, folder_id: id };
      Layout.create(file);
    });

    // update folder
    Folder.update(
      {
        name: (season === "WET" ? "WS" : "DS") + date,
        season: season,
        year: date,
        report: report
      },
      { where: { id: id } }
    ).then(result => {
      return result ? resolve(result) : reject(500);
    });
  });
};

/* updates a folder's files */
export const editFiles = ({ layout, report, id }) => {
  return new Promise((resolve, reject) => {
    // delete layouts concerned to folder
    Layout.destroy({ where: { folder_id: id } });
    // then create them again
    layout.map(file => {
      file = { ...file, folder_id: id };
      Layout.create(file);
    });

    Folder.update(
      {
        report: report
      },
      { where: { id: id } }
    ).then(result => {
      return result ? resolve(result) : reject(500);
    });
  });
};
