import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const SALT_WORK_FACTOR = 10;

const { Schema } = mongoose;

const users = new Schema({
  fullname: {
    type: String,
    required: true,
    AllowNull: false
  },
  emailId: {
    type: String,
    unique: true,
    AllowNull: false,
    required: true
  },
  password: {
    type: String,
    AllowNull: false
  },
  dob: {
    type: Date,
    AllowNull: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

users.pre("save", function(next) {
  let user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

export default mongoose.model("users", users);
