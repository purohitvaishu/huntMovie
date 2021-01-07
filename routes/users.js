import { Router } from 'express';

import { ensureAuthenticated } from '../middlewares/verifyAuth';

import callback from '../controllers/calendarCallback';
import event from '../controllers/event';
import watchlistRoute from '../controllers/watchlistList';
import watchlistControl from '../controllers/watchlist';
import shareMovie from '../controllers/shareMovie';
import notification from '../controllers/notification';
import notificationStatus from '../controllers/notificationStatus';

const router = Router();

router.post('/upcoming/event', ensureAuthenticated, event);

router.get('/auth/callback', ensureAuthenticated, callback);

router.get('/movies/watchlist/', ensureAuthenticated, watchlistRoute);

router.post('/movies/watchlist', ensureAuthenticated, watchlistControl);

router.post('/movies/share', ensureAuthenticated, shareMovie);

router.get('/notification/', ensureAuthenticated, notification);

router.post('/notification', ensureAuthenticated, notificationStatus);

export default router;
