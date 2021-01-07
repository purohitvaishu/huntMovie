import Users from "../models/users";
import registerValidation from "../utils/registerValidation";

const register = async (req, res, next) => {
  try {
    let err = [];
    const success = [];
    if (req.body.emailId) {
      const user = await Users.findOne({ emailId: req.body.emailId });
      if (user) {
        err.push("This email is registered with us, please try login");
      } else err = await registerValidation(req, err);
    }

    if (err.length > 0) {
      return res.render("register", { err, success });
    }

    const newUser = new Users(req.body);
    await newUser.save();

    success.push("User register sucessfully.");
    res.render("login", { success, err });
  } catch (err) {
    next(err);
  }
};

export default register;
