import { Router } from 'express';
import * as ctrl from './controller';

const router = Router();

/* This is when a user signs up */
router.post('/user/signup', async (req, res) => {
  try {
    const user = await ctrl.signup(req.body);

    res.status(200).json({
      status: 200,
      message: 'Successfully created user'
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 500:
        message = 'Internal server error while creating user';
        break;
      case 400:
        message = 'Bad request';
        break;
    }
    res.status(status).json({ status, message });
  }
});

/* This is to search for a user via email */
router.get(`/user/:email`, async (req, res) => {
  try {
    const user = await ctrl.getEmail(req.params);
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched user',
      data: user
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 404:
        message = 'User not found';
        break;
      case 500:
        message = 'Internal server error';
        break;
    }
    res.status(status).json({ status, message });
  }
});

export default router;
