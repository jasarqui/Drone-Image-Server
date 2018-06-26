import { Router } from 'express';
import * as ctrl from './controller';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const user = await ctrl.login(req.body);
    req.session.user = user;

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

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.status(200).json({
    status: 200,
    message: 'Successfully logged out'
  });
});

router.post('/session', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Successfully fetched current session',
    data: req.session.user ? req.session.user : null
  });
});

export default router;
