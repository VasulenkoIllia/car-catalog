const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const admin = await Admin.findOne({ username });

      if (!admin) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, admin);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((admin, done) => {
  done(null, admin.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const admin = await Admin.findById(id);
    done(null, admin);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
