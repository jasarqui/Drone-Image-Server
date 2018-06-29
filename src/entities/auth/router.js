import { Router } from 'express';
import * as ctrl from './controller';

const router = Router();

/* this is for a user login */
router.post('/login', async (req, res) => {
  try {
    const user = await ctrl.login(req.body);
    req.session.user = user; // store the session

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in',
      data: user
    });
  } catch (status) {
    let message = '';
    switch (status) {
      case 500:
        message = 'Internal server error while logging in';
        break;
      case 404:
        message = 'Wrong credentials';
        break;
    }
    res.status(status).json({ status, message });
  }
});

/* this is for a user logout */
router.post('/logout', (req, res) => {
  req.session.destroy(); // delete stored session
  res.status(200).json({
    status: 200,
    message: 'Successfully logged out'
  });
});

/* gets the stored session */
router.post('/session', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Successfully fetched current session',
    data: req.session.user ? req.session.user : null
  });
});

export default router;
