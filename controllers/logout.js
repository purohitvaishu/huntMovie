const logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are successfully logged out');
  res.redirect('/');
};

export default logout;
