import genre from '../models/genre';
import languages from '../models/languages';
import movieCasts from '../models/movieCasts';
import movies from '../models/movies';
import movieGenre from '../models/movieGenre';
import movieLanguage from '../models/movieLanguage';
import watchlist from '../models/watchlist';
import countNotification from '../services/countNotification';

const movieInfo = async (req, res, next) => {
  const splitInfo = Object.keys(req.query);
  const id = splitInfo[0];
  let watchlistStatus;
  let movieWatchlist;
  let notifications;
  const genres = [];
  const lang = [];
  const cast = [];
  try {
    if (req.user !== undefined) {
      [movieWatchlist, notifications] = await Promise.all([
        watchlist.findOne({ watchlist_movie_id: id, user_id: req.user._id }),
        countNotification(req.user._id)
      ]);
      if (movieWatchlist === null) {
        watchlistStatus = 'Add to watchlist';
      } else {
        watchlistStatus = 'Delete from watchlist';
      }
    }

    const [movie, genreMovie, language, casts] = await Promise.all([
      movies.findOne({ id }),
      movieGenre.find({ movie_id: id }),
      movieLanguage.find({ movie_id: id }),
      movieCasts.find({ movie_id: id })
    ]);

    const genrePromise = genreMovie.map(async (item) => {
      const genreName = await genre.findOne({ id: item.genre });
      genres.push(genreName.name);
    });

    const langPromise = language.map(async (data) => {
      const languageList = await languages.findOne({
        iso_639_1: data.iso_639_1
      });
      lang.push(languageList.name);
    });

    for (let count = 0; count < 5 && casts.length !== 0; count += 1) {
      cast.push({
        name: casts[0].cast[count].name,
        profile_path: casts[0].cast[count].profile_path
      });
    }

    const date = movie.release_date.toLocaleDateString();

    await Promise.all(langPromise, genrePromise);

    if (req.user === undefined) {
      return res.render('readMore', {
        user: 0,
        movie,
        cast,
        genres,
        lang,
        type: 'movie',
        date,
        perPage: 6
      });
    }
    return res.render('readMore', {
      user: req.user._id,
      movie,
      cast,
      notifications,
      watchlistStatus,
      genres,
      lang,
      type: 'movie',
      date,
      perPage: 6
    });
  } catch (err) {
    next(err);
  }
};
export default movieInfo;
