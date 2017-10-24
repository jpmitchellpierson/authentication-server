const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  // Use userID + secret string to encode JWT 
  // sub = subject of token (user)
  // iat = issued at time
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function (req, res, next) {
  // User has already had their email and pw auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  // check that email and password are provided
  if (!email || !password) {
    res.status(422).send({ error: 'You must provide email and passowrd' });
  }

  // See if a user with the given email exists
  User.findOne({ email: email }, function (err, existingUser) {
    if (err) { return next(err); };

    // If a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'This email is already in use.' })
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    // saving user is async process
    user.save(function (err) {
      if (err) { return next(err); };

      // Respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
}