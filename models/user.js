const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On save hook, encrupt password
// before the model gets saved, run this function
userSchema.pre('save', function(next) {
  // create instance of user model to get access
  const user = this;

  // generate a salt, then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
      // go ahead and save the model
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  // this.password is hashed and salted pw in database
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

// Create model class
// New schema that corresponds to collection named 'user'
const ModelClass = mongoose.model('user', userSchema);

// Export model
module.exports = ModelClass;