import countNotification from "../services/countNotification";
import moviesList from "../models/movies";

const movie = async (req, res, next) => {
  try {
    const perPage =
      parseInt(req.query.perPage) || parseInt(process.env.perPage);
    const page = parseInt(req.query.page) || 1;
    let notifications = 0;
    let movies;
    let count;

    [movies, count] = await Promise.all([
      moviesList
        .find({})
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(),
      moviesList.count()
    ]);

    if (req.user === undefined) {
      return res.render("moviesList", {
        movies,
        current: page,
        pages: Math.ceil(count / perPage),
        user: 0,
        perPage
      });
    }
    notifications = await countNotification(req.user._id);

    return res.render("moviesList", {
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

export default movie;
