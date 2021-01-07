import bcrypt from 'bcryptjs';
import { Strategy as localStrategy } from 'passport-local';

import users from '../models/users';

const authPassport = (passport) => {
  passport.serializeUser(async (user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await users.findById(id);
      done(null, user);
    } catch (err) {
      console.log(err);
    }
  });

  passport.use(
    new localStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const user = await users.findOne({ emailId: email });

          if (user === null) {
            return done(null, false, {
              message: 'The email is not registered',
            });
          }
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            }

            if (!isMatch) {
              return done(null, false, { message: 'password incorrect' });
            }
          });
        } catch (err) {
          console.log(err);
        }
      },
    ),
  );
};

export default authPassport;
