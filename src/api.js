import { Router } from 'express';

/* import <router_name> from './entities/<folder>/router'; */
import authRouter from './entities/auth/router';
import userRouter from './entities/user/router';

const router = Router();

/* router.use(<router_name>); */
router.use(authRouter);
router.use(userRouter);

export default router;
