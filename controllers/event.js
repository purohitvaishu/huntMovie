import to from "await-to-js";

import createEvent from '../services/createEvent';
import deleteEvent from '../services/deleteEvent';
import { tokens } from '../services/tokens';

import upcomingModel from "../models/upcoming";
import tokenModel from "../models/tokens";
import Follow from "../models/followMovie";
import Notification from "../models/notifications";

const unfollow = async (req, res, auth) => {
  try {
    const eventData = await Follow.findOne({
      movie_id: req.body.movieId,
      user_id: req.user._id
    });
    const [error] = await to(deleteEvent(auth, eventData));
    if (error) {
      if (error === 401 || error === 400) {
        await tokenModel.findOneAndDelete({ id: req.user._id });
        return createEvent(req, res);
      }
      return res.send({
        success: true,
        status: "error",
        message: "An error occured"
      });
    }

    await Follow.findOneAndDelete({
      movie_id: req.body.movieId,
      user_id: req.user._id
    });

    const message = "Event is successfully deleted";
    res.send({ status: "success", message, follow_status: "Follow" });
  } catch (err) {
    res.send({ success: true, status: "error", message: "An error occured" });
  }
};

const follow = async (req, res, auth) => {
  try {
    const movie = await upcomingModel.findOne({ id: req.body.movieId });
    const [error, eventId] = await to(createEvent(auth, movie));
    if (error) {
      if (error.response.status === 401 || error.response.status === 400) {
        await tokenModel.findOneAndDelete({ id: req.user._id });
        return createEvent(req, res);
      }
      return res.send({
        success: true,
        status: "error",
        message: "An error occured"
      });
    }

    const newFollow = new Follow({
      movie_id: req.body.movieId,
      user_id: req.user._id,
      event_id: eventId
    });
    await newFollow.save();

    const newNotification = new Notification({
      user_id: req.user._id,
      message: `You are following ${movie.title}.`,
      friend_email: null,
      read_notification: 0
    });
    await newNotification.save();

    const message = "Event is successfully created";
    res.send({ status: "success", message, follow_status: "Unfollow" });
  } catch (err) {
    res.send({ success: true, status: "error", message: "An error occured" });
  }
};

const modifyEvent = async (req, res) => {
  try {
    const data = await tokens(req.user._id);

    if (data[0] === "event") {
      if (req.body.isFollowed === "Follow") {
        return follow(req, res, data[1]);
      }
      return unfollow(req, res, data[1]);
    } else {
      const message = "Redirecting to the google authentication page";
      res.send({ status: "success", redirect: data[1], message });
    }
  } catch (err) {
    res.send({ success: true, status: "error", message: "An error occured" });
  }
};

export default modifyEvent;
