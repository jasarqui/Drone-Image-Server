import { Router } from 'express';
import * as ctrl from './controller';

const router = Router();

/* This is when a user adds a folder */
router.post('/folder/add', async (req, res) => {
  try {
    await ctrl.addFolder(req.body);

    res.status(200).json({
      status: 200,
      message: 'Successfully added folder'
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 500:
        message = 'Internal server error while adding folder';
        break;
      case 400:
        message = 'Folder already exists';
        break;
    }
    res.status(status).json({ status, message });
  }
});

/* This is to edit a folder */
router.put(`/folder/edit`, async (req, res) => {
  try {
    await ctrl.editFolder(req.body);
    res.status(200).json({
      status: 200,
      message: 'Successfully edited folder'
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 400:
        message = 'Folder already exists';
        break;
      case 404:
        message = 'Folder not found';
        break;
      case 500:
        message = 'Internal server error';
        break;
    }
    res.status(status).json({ status, message });
  }
});

/* This is to edit files of a folder */
router.put(`/folder/files/edit`, async (req, res) => {
  try {
    await ctrl.editFiles(req.body);
    res.status(200).json({
      status: 200,
      message: 'Successfully edited folder'
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 400:
        message = 'Folder already exists';
        break;
      case 404:
        message = 'Folder not found';
        break;
      case 500:
        message = 'Internal server error';
        break;
    }
    res.status(status).json({ status, message });
  }
});

/* This is to retrieve the total page count */
router.get(
  `/folder/count/:myUpload&:category&:showData&:search`,
  async (req, res) => {
    try {
      const totalPages = await ctrl.countFolderPages({
        category: req.params.category,
        showData: req.params.showData,
        user: req.params.myUpload === 'true' ? req.session.user.id : null,
        search: req.params.search !== 'null' ? req.params.search : null
      });

      res.status(200).json({
        status: 200,
        message: 'Successfully fetched total pages',
        data: totalPages
      });
    } catch (status) {
      let message = '';
      switch (status) {
        case 404:
          message = 'No folders found';
          break;
        case 500:
          message = 'Internal server error';
          break;
      }
      res.status(status).json({ status, message });
    }
  }
);

/* This is to retrieve the folders */
router.get(
  `/folder/:myUpload&:category&:showData&:search&:start`,
  async (req, res) => {
    try {
      const folders = await ctrl.getFolders({
        category: req.params.category,
        showData: req.params.showData,
        user: req.params.myUpload === 'true' ? req.session.user.id : null,
        search: req.params.search !== 'null' ? req.params.search : null,
        start: parseInt(req.params.start)
      });

      res.status(200).json({
        status: 200,
        message: 'Successfully fetched all folders',
        data: folders
      });
    } catch (status) {
      let message = '';
      switch (status) {
        case 404:
          message = 'No folders found';
          break;
        case 500:
          message = 'Internal server error';
          break;
      }
      res.status(status).json({ status, message });
    }
  }
);

/* This is to retrieve all folders */
router.get(`/folder/all`, async (req, res) => {
  try {
    const folders = await ctrl.getAllFolders();

    res.status(200).json({
      status: 200,
      message: 'Successfully fetched all folders',
      data: folders
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 404:
        message = 'No folders found';
        break;
      case 500:
        message = 'Internal server error';
        break;
    }
    res.status(status).json({ status, message });
  }
});

/* This is to retrieve a folder */
router.get(`/folder/:id`, async (req, res) => {
  try {
    const folder = await ctrl.getFolder(req.params.id);

    res.status(200).json({
      status: 200,
      message: 'Successfully fetched folder',
      data: folder
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 404:
        message = 'No folder found';
        break;
      case 500:
        message = 'Internal server error';
        break;
    }
    res.status(status).json({ status, message });
  }
});

export default router;
