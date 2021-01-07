import countNotification from '../services/countNotification';

const home = async (req, res, next) => {
  try {
    if (req.user === undefined) {
      return res.render('home', { user: 0 });
    }
    const notifications = await countNotification(req.user._id);
    res.render('home', { user: req.user._id, notifications });
  } catch (err) {
    next(err);
  }
};

export default home;
