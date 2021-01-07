import passport from "passport";
import { Strategy as TwitterStrategy } from "passport-twitter";
import dotenv from "dotenv";

import User from "../models/users";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(done);
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.twitterClientId,
      consumerSecret: process.env.twitterClientSecret,
      callbackURL: process.env.twitterCallbackURL
    },
    (token, tokenSecret, profile, done) => {
      process.nextTick(async () => {
        const user = await User.findOne({
          emailId: profile.emails[0].value
        }).catch(err => done(err));

        // if the user is found then log them in
        if (user) {
          return done(null, user); // user found, return that user
        }
        const newUser = new User({
          emailId: profile.emails[0].value,
          fullname: profile.displayName
        });

        // save our user into the database
        newUser.save(error => {
          if (error) throw error;
          return done(null, newUser);
        });
      });
    }
  )
);

const TwitterRoutes = {
  authenticate: () =>
    passport.authenticate("twitter", {
      scope: ["include_email=true"]
    }),

  callback: () =>
    passport.authenticate("twitter", {
      failureRedirect: "/login",
      successRedirect: "/"
    })
};

export default TwitterRoutes;
