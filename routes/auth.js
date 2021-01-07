import { Router } from 'express';

import { forwardAuthenticated } from '../middlewares/verifyAuth';
import GoogleRoutes from '../auth/googleAuth';
import login from '../controllers/login';
import logout from '../controllers/logout';
import register from '../controllers/register';
import TwitterRoutes from '../auth/twitterAuth';
import { getLogin, getRegister } from '../controllers/loginRegister';

const router = Router();

router.get('/login', forwardAuthenticated, getLogin);
router.post('/login', login);

router.get('/register', forwardAuthenticated, getRegister);
router.post('/register', register);

router.get('/logout', logout);

router.get('/google', GoogleRoutes.authenticate());

router.get('/google/return', GoogleRoutes.callback());

router.get('/twitter', TwitterRoutes.authenticate());

router.get('/twitter/return', TwitterRoutes.callback());

export default router;
