import trendingMovies from '../models/trending';
import countNotification from '../services/countNotification';

const trending = async (req, res, next) => {
  try {
    const perPage = parseInt(req.query.perPage) || parseInt(process.env.perPage);
    const page = parseInt(req.query.page) || 1;
    let notifications = 0;
    let movies;
    let count;

    [movies, count] = await Promise.all([
      trendingMovies.find({}).skip((perPage * page) - perPage).limit(perPage).exec(),
      trendingMovies.count(),
    ]);

    if (req.user !== undefined) {
      notifications = await countNotification(req.user._id);
    }

    if (req.user === undefined) {
      return res.render('trending', {
        movies,
        current: page,
        pages: Math.ceil(count / perPage),
        user: 0,
        perPage
      });
    }

    return res.render('trending', {
      notifications,
      movies,
      current: page,
      pages: Math.ceil(count / perPage),
      user: req.user._id,
      perPage
    });
  } catch (err) {
    next(err);
  }
};

export default trending;
