import { Router } from 'express';

/* import <router_name> from './entities/<folder>/router'; */
import authRouter from './entities/auth/router';
import userRouter from './entities/user/router';
import imgRouter from './entities/img/router';
import folderRouter from './entities/folder/router';

const router = Router();

/* router.use(<router_name>); */
router.use(authRouter);
router.use(userRouter);
router.use(imgRouter);
router.use(folderRouter);

export default router;
