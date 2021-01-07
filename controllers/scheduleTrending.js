import cron from "node-cron";
import dotenv from "dotenv";
import unirest from "unirest";

import cast from "../services/castUpcomingTrending";
import TrendingMovies from "../models/trending";
import winston from "winston";

dotenv.config();

const taskTrending = cron.schedule(process.env.trendingCron, () => {
  const Request = unirest.get(process.env.trendingURL);
  Request.query({
    api_key: process.env.tmdb_key
  });
  Request.end(async result => {
    if (result.err) throw new Error(result.err);
    const data = result.body.results;
    try {
      await TrendingMovies.deleteMany({});

      for (let count = 0; count < data.length; count += 1) {
        const credits = await cast(data[count].id);

        const newTrending = await new TrendingMovies({
          title: data[count].original_title,
          overview: data[count].overview,
          id: data[count].id,
          release_date: data[count].release_date,
          genres: data[count].genre_ids,
          languages: data[count].original_language,
          poster_path: data[count].poster_path,
          cast: credits
        });
        await newTrending.save();
      }
    } catch (err) {
      winston.error(
        `${err.status || 500} - ${
          err.message
        } - Schedule for updating trendingmovies`
      );
    }
  });
});
export default taskTrending;
