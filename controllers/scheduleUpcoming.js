import cron from "node-cron";
import dotenv from "dotenv";
import unirest from "unirest";
import winston from "winston";

import UpcomingMovies from "../models/upcoming";
import cast from "../services/castUpcomingTrending";
import Notification from "../models/notifications";
import followMovie from "../models/followMovie";

dotenv.config();

const saveUpcoming = async result => {
  try {
    const data = result.body.results;

    for (let count = 0; count < data.length; count += 1) {
      const upcoming = await UpcomingMovies.findOne({ id: data[count].id });
      if (upcoming === null) {
        const credits = await cast(data[count].id);

        const newUpcoming = new UpcomingMovies({
          title: data[count].original_title,
          overview: data[count].overview,
          id: data[count].id,
          release_date: data[count].release_date,
          genres: data[count].genre_ids,
          languages: data[count].original_language,
          poster_path: data[count].poster_path,
          cast: credits
        });
        await newUpcoming.save();

        continue;
      }

      const checkFollow = await followMovie.find({ movie_id: data[count].id });
      const date = new Date(data[count].release_date).toDateString();

      if (date !== upcoming.release_date) {
        await UpcomingMovies.updateOne(
          { id: data[count].id },
          { release_date: data[count].release_date }
        );

        if (checkFollow) {
          checkFollow.forEach(async movieData => {
            const newNotification = new Notification({
              user_id: movieData.user_id,
              message: `${title[count]} releasing date updated.`,
              friend_email: null,
              read_notification: 0
            });
            await newNotification.save();
          });
        }
      }
    }
  } catch (err) {
    winston.error(
      `${err.status || 500} - ${
        err.message
      } - Schedule for updating upcoming movies`
    );
  }
};

const taskUpcoming = cron.schedule(process.env.upcomingCron, async () => {
  const Request = unirest.get(process.env.upcomingUrl);
  Request.query({
    page: "1",
    language: "en-US",
    api_key: process.env.tmdb_key,
    region: "US"
  });

  try {
    const data = await UpcomingMovies.find({
      release_date: { $lte: new Date() }
    });
    data.forEach(async list => {
      await UpcomingMovies.findOneAndDelete({ id: list.id });
    });

    Request.end(async result => {
      if (result.error) throw new Error(result.error);

      saveUpcoming(result);
    });
  } catch (err) {
    winston.error(
      `${err.status || 500} - ${
        err.message
      } - Schedule for updating upcoming movies`
    );
  }
});

export default taskUpcoming;
