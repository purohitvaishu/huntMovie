export const getLogin = (req, res) => {
  res.render('login', { err: 0, success: 0 });
};

export const getRegister = (req, res) => {
  res.render('register', { err: 0 });
};
