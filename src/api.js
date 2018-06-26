import { Router } from 'express';

/* import <router_name> from './entities/<folder>/router'; */
import authRouter from './entities/auth/router';

const router = Router();

/* router.use(<router_name>); */
router.use(authRouter);

export default router;
