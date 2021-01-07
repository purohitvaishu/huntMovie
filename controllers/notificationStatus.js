import notification from '../models/notifications';

const status = async (req, res, next) => {
  try {
    const statusUpdate = await notification.updateOne(
      { _id: req.body.id },
      { read_notification: true },
    );

    if (statusUpdate) {
      return res.send({ sucsess: true });
    }

    return res.send({ err: true });
  } catch (err) {
    next(err);
  }
};

export default status;
