import passport from 'passport';

const login = (req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/',
  })(req, res, next);
};

export default login;
