import notifications from '../models/notifications';
import users from '../models/users';

const notification = async (id) => {
  try {
    const userEmail = await users.findOne({ _id: id });
    const [followCount, shareCount] = await Promise.all([
      notifications
        .count({ user_id: id, friend_emailId: null, read_notification: false }),
      notifications
        .count({ friend_emailId: userEmail.emailId, read_notification: false }),
    ]);
    const count = shareCount + followCount;
    return count;
  } catch (err) {
    throw new Error(err);
  }
};

export default notification;
