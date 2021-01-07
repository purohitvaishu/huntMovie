import Users from "../models/users";

const registerValidation = async (req, err) => {
  if (
    !req.body.emailId ||
    !req.body.fullname ||
    !req.body.password ||
    !req.body.cpass ||
    !req.body.dob
  ) {
    err.push("All fields are required");
  } else {
    if (req.body.emailId !== new RegExp(process.env.emailPattern)) {
      err.push("Email id is incorrect.");
    }

    if (req.body.password !== new RegExp(process.env.passwordPattern)) {
      err.push("Password must contain numbers and special characters.");
    } else if (req.body.password.length !== 8) {
      err.push("Password must have minimum length of 8.");
    }

    if (req.body.fullname !== new RegExp(process.env.namePattern)) {
      err.push("Name field only contains characters.");
    }

    if (req.body.password !== req.body.cpass) {
      err.push("Password and confirm password filed should match.");
    }
  }
  return err;
};
export default registerValidation;
