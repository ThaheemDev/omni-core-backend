const passport = require('passport');
const response = require('../lib/response');

// login to user
const login = async (req, res, next) => {
  console.log('req.body', req.body)
  passport.authenticate('local', (error, auser) => {
    console.log('auser', auser)
    console.log('error', error)

    if (error) {
      return res.status(401).send(response.error({message: 'Invalid username or password.'}));
    }
    if (!auser) {
      return res.status(401).send(response.error({message: 'Invalid username or password.'}));
    }

    req.logIn(auser, function (err) {
      if (err) {
        return next(err);
      }
      return res.status(204).send();
    });
  }, (err) => {
    console.log('err', err)
    res.status(500).send(response.error(err));
  })(req, res, next)
}

const logout = async (req, res) => {
  req.logout();
  return res.send();
}
module.exports = {
  login,
  logout
}
