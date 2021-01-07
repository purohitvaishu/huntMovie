import countNotification from "../services/countNotification";
import upcomingMovies from "../models/upcoming";

const upcoming = async (req, res, next) => {
  try {
    const perPage =
      parseInt(req.query.perPage) || parseInt(process.env.perPage);
    const page = parseInt(req.query.page) || 1;
    let notifications = 0;

    const movies = await upcomingMovies
      .find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await upcomingMovies.count();

    if (req.user !== undefined) {
      notifications = await countNotification(req.user._id);
    }

    if (req.user === undefined) {
      return res.render("upcoming", {
        movies,
        current: page,
        pages: Math.ceil(count / perPage),
        user: 0,
        perPage
      });
    }

    notifications = await countNotification(req.user._id);

    return res.render("upcoming", {
      notifications,
      movies,
      current: page,
      pages: Math.ceil(count / perPage),
      user: req.user._id,
      perPage
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export default upcoming;
