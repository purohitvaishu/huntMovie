import countNotification from '../services/countNotification';
import movieList from '../models/movies';
import trendingMovies from '../models/trending';
import upcomingMovie from '../models/upcoming';
import watchList from '../models/watchlist';

const watchlist = async (req, res, next) => {
  const perPage = parseInt(req.query.perPage) || parseInt(process.env.perPage);
  const page = parseInt(req.query.page) || 1;
  const allMovies = [];

  try {
    const movies = await watchList
      .find({ user_id: req.user._id })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const totalList = await watchList.count({ user_id: req.user._id });

    const notifications = await countNotification(req.user._id);

    for (let count = 0; count < totalList; count += 1) {
      if (movies[count].type === 'upcoming') {
        const movie = await upcomingMovie.findOne({
          id: movies[count].watchlist_movie_id
        });
        allMovies.push(movie);
      }

      if (movies[count].type === 'trending') {
        const movie = await trendingMovies.findOne({
          id: movies[count].watchlist_movie_id
        });
        allMovies.push(movie);
      }

      if (movies[count].type === 'movie') {
        const movie = await movieList.findOne({
          id: movies[count].watchlist_movie_id
        });
        allMovies.push(movie);
      }
    }

    res.render('watchlist', {
      notifications,
      movies: allMovies,
      current: page,
      pages: Math.ceil(totalList / perPage),
      user: req.user._id,
      perPage
    });
  } catch (err) {
    next(err);
  }
};

export default watchlist;
