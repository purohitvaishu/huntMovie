import watchlist from '../models/watchlist';
import upcomingMovieInfo from './upcomingMovieInfo';
import trendingMovieInfo from './trendingMovieInfo';
import movieInfo from './movieInfo';

const readMore = async (req, res, next) => {
  const splitInfo = Object.keys(req.query);
  const id = splitInfo[0];
  let type = splitInfo[1];
  try {
    if (type === 'watchlist') {
      const movie = await watchlist.findOne({ watchlist_movie_id: id });
      type = movie.type;
    }

    if (type === 'upcoming') {
      upcomingMovieInfo(req, res, next);
    }

    if (type === 'trending') {
      trendingMovieInfo(req, res, next);
    }

    if (type === 'movie') {
      movieInfo(req, res, next);
    }
  } catch (err) {
    next(err);
  }
};
export default readMore;
