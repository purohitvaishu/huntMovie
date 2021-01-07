import countNotification from '../services/countNotification';
import genreId from '../models/genre';
import watchlist from '../models/watchlist';
import trending from '../models/trending';

const readMore = async (req, res, next) => {
  try {
    const splitInfo = Object.keys(req.query);
    const id = splitInfo[0];
    let notifications = 0;
    let movieWatchlist;
    let watchlistStatus;
    const genres = [];
    const cast = [];

    if (req.user !== undefined) {
      [movieWatchlist, notifications] = await Promise.all([
        watchlist
          .findOne({ watchlist_movie_id: id, user_id: req.user._id }),
        countNotification(req.user._id),
      ]);

      if (movieWatchlist === null) {
        watchlistStatus = 'Add to watchlist';
      } else {
        watchlistStatus = 'Delete from watchlist';
      }
    }

    const movie = await trending.findOne({ id });

    const genrePromise = movie.genres.map(async (data) => {
      const genreName = await genreId.findOne({ id: data });
      genres.push(genreName.name);
    });

    for (let count = 0; count < 5; count += 1) {
      cast.push(movie.cast[count]);
    }

    const date = movie.release_date.toLocaleDateString();
    const lang = movie.languages;

    await Promise.all(genrePromise);

    if (req.user === undefined) {
      return res.render('readMore', {
        user: 0,
        movie,
        genres,
        cast,
        lang,
        type: 'trending',
        date,
        perPage: 6
      });
    }
    return res.render('readMore', {
      user: req.user._id,
      movie,
      cast,
      watchlistStatus,
      notifications,
      genres,
      lang,
      type: 'trending',
      date,
      perPage: 6
    });
  } catch (err) {
    next(err);
  }
};

export default readMore;
