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

/* This is to retrieve the images */
router.get(`/img`, async (req, res) => {
  try {
    const images = await ctrl.getImages();
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
});

/* This sends the info from the image to the database */
router.put('/img/update', async (req, res) => {
  try {
    // const image = await ctrl.updateImage(req.body);

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

/* deletes an image 
router.delete(`/img/:id`, async (req, res) => {
  try {
    await ctrl.deleteImage(req.params);
    res.status(200).json({
      status: 200,
      message: 'Successfully deleted the image'
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
*/

export default router;
