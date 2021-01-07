import countNotification from '../services/countNotification';
import followMovies from '../models/followMovie';
import genreId from '../models/genre';
import upcoming from '../models/upcoming';
import watchlist from '../models/watchlist';

const readMore = async (req, res, next) => {
  try {
    const splitInfo = Object.keys(req.query);
    const id = splitInfo[0];
    let notifications = 0;
    let watchlistStatus;
    let followStatus;
    let follow;
    let movieWatchlist;
    const genres = [];
    const cast = [];

    const movie = await upcoming.findOne({ id });

    if (req.user !== undefined) {
      [movieWatchlist, notifications, follow] = await Promise.all([
        watchlist
          .findOne({ watchlist_movie_id: id, user_id: req.user._id }),
        countNotification(req.user._id),
        followMovies
          .findOne({ user_id: req.user._id, movie_id: movie.id }),
      ]);

      if (movieWatchlist === null) {
        watchlistStatus = 'Add to watchlist';
      } else {
        watchlistStatus = 'Delete from watchlist';
      }

      if (follow === null) {
        followStatus = 'Follow';
      } else {
        followStatus = 'Unfollow';
      }
    }

    const genrePromise = movie.genres.map(async (item) => {
      const genreName = await genreId.findOne({ id: item });
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
        cast,
        genres,
        lang,
        type: 'upcoming',
        date,
        perPage: 6
      });
    }

    return res.render('readMore', {
      user: req.user._id,
      movie,
      genres,
      notifications,
      followStatus,
      watchlistStatus,
      cast,
      lang,
      type: 'upcoming',
      date,
      perPage: 6
    });
  } catch (err) {
    next(err);
  }
};

export default readMore;
