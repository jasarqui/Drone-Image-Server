import { Router } from 'express';
import * as ctrl from './controller';

const router = Router();

/* This sends the info from the image to the database */
router.post('/img/save', async (req, res) => {
  try {
    const image = await ctrl.save(req.body);

    res.status(200).json({
      status: 200,
      message: 'Successfully uploaded image'
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 500:
        message = 'Internal server error while uploading image';
        break;
      case 400:
        message = 'Bad request';
        break;
    }
    res.status(status).json({ status, message });
  }
});

/* This sends the images to be saved to the database */
router.post('/img/saveMany', async (req, res) => {
  try {
    const image = await ctrl.saveMany(req.body);

    res.status(200).json({
      status: 200,
      message: 'Successfully uploaded image'
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 500:
        message = 'Internal server error while uploading image';
        break;
      case 400:
        message = 'Bad request';
        break;
    }
    res.status(status).json({ status, message });
  }
});

/* This updates the image */
router.put('/img/update', async (req, res) => {
  try {
    await ctrl.updateImage(req.body);

    res.status(200).json({
      status: 200,
      message: 'Successfully updated image'
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 500:
        message = 'Internal server error while updating image';
        break;
      case 400:
        message = 'Bad request';
        break;
    }
    res.status(status).json({ status, message });
  }
});

/* This segments the image */
router.post('/img/segment', async (req, res) => {
  try {
    const fields = await ctrl.segmentImage({file: req.body});

    res.status(200).json({
      status: 200,
      message: 'Successfully segmented image',
      data: fields
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 500:
        message = 'Internal server error while segmenting image';
        break;
      case 400:
        message = 'Bad request';
        break;
    }
    res.status(status).json({ status, message });
  }
});

/* This is to retrieve the total page count */
router.get(
  `/img/count/:myUpload&:category&:showData&:search&:folder_id`,
  async (req, res) => {
    try {
      const totalPages = await ctrl.countPages({
        category: req.params.category,
        showData: req.params.showData,
        user: req.params.myUpload === 'true' ? req.session.user.id : null,
        search: req.params.search !== 'null' ? req.params.search : null,
        folder_id: req.params.folder_id
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
          message = 'No images found';
          break;
        case 500:
          message = 'Internal server error';
          break;
      }
      res.status(status).json({ status, message });
    }
  }
);

/* This is to retrieve the images */
router.get(
  `/img/:myUpload&:category&:showData&:search&:folder_id&:start`,
  async (req, res) => {
    try {
      const images = await ctrl.getImages({
        category: req.params.category,
        showData: req.params.showData,
        user: req.params.myUpload === 'true' ? req.session.user.id : null,
        search: req.params.search !== 'null' ? req.params.search : null,
        folder_id: req.params.folder_id,
        start: parseInt(req.params.start)
      });

      res.status(200).json({
        status: 200,
        message: 'Successfully fetched all images',
        data: images
      });
    } catch (status) {
      let message = '';
      switch (status) {
        case 404:
          message = 'No images found';
          break;
        case 500:
          message = 'Internal server error';
          break;
      }
      res.status(status).json({ status, message });
    }
  }
);

/* this is to archive an image */
router.put(`/img/archive`, async (req, res) => {
  try {
    await ctrl.archiveImage(req.body);
    res.status(200).json({
      status: 200,
      message: 'Successfully archived the image'
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 404:
        message = 'Image not found';
        break;
      case 500:
        message = 'Internal server error';
        break;
    }
    res.status(status).json({ status, message });
  }
});

/* this is to unarchive an image */
router.put(`/img/unarchive`, async (req, res) => {
  try {
    await ctrl.unarchiveImage(req.body);
    res.status(200).json({
      status: 200,
      message: 'Successfully unarchived the image'
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 404:
        message = 'Image not found';
        break;
      case 500:
        message = 'Internal server error';
        break;
    }
    res.status(status).json({ status, message });
  }
});

/* This is to retrieve an image */
router.get(`/img/view/:id`, async (req, res) => {
  try {
    const image = await ctrl.getImage(req.params.id);

    res.status(200).json({
      status: 200,
      message: 'Successfully fetched all images',
      data: image
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 404:
        message = 'Image not found';
        break;
      case 500:
        message = 'Internal server error';
        break;
    }
    res.status(status).json({ status, message });
  }
});

export default router;
