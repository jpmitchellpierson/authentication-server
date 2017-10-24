const Authentication = require('./controllers/authentication');
const passportServices = require('./services/passport');

const passport = require('passport');

// any route we want to require authentication for, we can use requireAuth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

// export function in node
// gain access to express app by calling function with app in index
module.exports = function (app) {
  app.get('/', requireAuth, function (req, res) {
    res.send({ hi: 'there' });
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
}