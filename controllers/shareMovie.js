import sgMail from "@sendgrid/mail";

import user from "../models/users";
import Notification from "../models/notifications";

const share = async (req, res) => {
  const value = `${req.body.id}-${req.body.db}-${req.body.title
    .split(" ")
    .join("%20")}`;

  sgMail.setApiKey(process.env.sendgridAPI);

  if (!req.body.emailId === new RegExp(process.env.emailPattern)) {
    return res.send({ error: true });
  }

  const msg = {
    to: req.body.emailId,
    from: process.env.fromEmail,
    subject: process.env.subject,
    text: process.env.text,
    html: process.env.mailRedirectURL + value + process.env.info
  };

  sgMail.send(msg);

  try {
    const uname = await user.findOne({ _id: req.user._id });

    const newNotification = new Notification({
      user_id: uname._id,
      message: `${uname.fullname} shared a movie with you.`,
      friend_emailId: req.body.emailId,
      read_notification: 0
    });
    await newNotification.save();

    return res.send({ success: true });
  } catch (err) {
    return res.send({ err: true });
  }
};

export default share;
