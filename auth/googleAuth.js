import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import dotenv from "dotenv";

import Users from "../models/users";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  Users.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(done);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientId,
      clientSecret: process.env.googleClientSecret,
      callbackURL: process.env.googleCallbackURL
    },

    (token, tokenSecret, profile, done) => {
      process.nextTick(async () => {
        const user = await Users.findOne({
          emailId: profile.emails[0].value
        }).catch(err => done(err));

        // if the user is found then log them in
        if (user) {
          return done(null, user); // user found, return that user
        }
        const newUser = new Users({
          emailId: profile.emails[0].value,
          fullname: `${profile.name.givenName} ${profile.name.familyName}`
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

const GoogleRoutes = {
  authenticate: () =>
    passport.authenticate("google", { scope: ["profile", "email"] }),

  callback: () =>
    passport.authenticate("google", {
      failureRedirect: "/login",
      successRedirect: "/"
    })
};

export default GoogleRoutes;
