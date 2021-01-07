import notiFication from "../models/notifications";
import users from "../models/users";

let notifications = [],
  perPage,
  page,
  user;

const followNotification = async () => {
  const followMovie = await notiFication
    .find({ user_id: user._id, friend_emailId: null })
    .skip((perPage / 2) * page - perPage / 2)
    .limit(perPage / 2)
    .exec();

  followMovie.forEach(data => {
    notifications.push({
      message: data.message,
      status: data.read_notification,
      id: data._id
    });
  });
};

const shareNotification = async () => {
  const shareMovie = await notiFication
    .find({ friend_emailId: user.emailId })
    .skip((perPage / 2) * page - perPage / 2)
    .limit(perPage / 2)
    .exec();

  shareMovie.forEach(shareList => {
    notifications.push({
      message: shareList.message,
      status: shareList.read_notification,
      id: shareList._id
    });
  });
};

const notification = async (req, res, next) => {
  try {
    perPage = parseInt(req.query.perPage) || parseInt(process.env.perPage);
    page = parseInt(req.query.page) || 1;

    user = await users.findOne({ _id: req.user._id });

    const [
      follow,
      share,
      followNotificationCount,
      shareNotificationCount
    ] = await Promise.all([
      followNotification(),
      shareNotification(),
      notiFication.count({ user_id: req.user._id, friend_emailId: null }),
      notiFication.count({ friend_emailId: user.emailId })
    ]);

    const count =
      followNotificationCount > shareNotificationCount
        ? followNotificationCount
        : shareNotificationCount;

    if (req.user === undefined) {
      return res.render("notification", {
        notifications,
        current: page,
        pages: Math.ceil(count / perPage),
        user: 0,
        perPage
      });
    }

    return res.render("notification", {
      notifications,
      current: page,
      pages: Math.ceil(count / perPage),
      user: req.user._id,
      perPage
    });
  } catch (err) {
    next(err);
  }
};

export default notification;
