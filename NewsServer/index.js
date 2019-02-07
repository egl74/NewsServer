require('dotenv').load();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const Strategy = require('passport-facebook').Strategy;
passport.use(new Strategy({
    clientID: process.env['FACEBOOK_CLIENT_ID'],
    clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
    callbackURL: '/auth/facebook/callback'
  },
  function (accessToken, refreshToken, profile, done) {
    User.upsertFbUser(accessToken, refreshToken, profile, function (err, user) {
      return done(err, user);
    });
  }
));
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const port = 3000;
const logger = createLogger({
  format: combine(label(), timestamp(), prettyPrint()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' })
  ]
});
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/news');

const newsSchema = new mongoose.Schema({
  author: String,
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: String,
});
const UserSchema = new mongoose.Schema({
  email: {
        type: String, required: true,
        trim: true, unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  facebookProvider: {
        type: {
              id: String,
              token: String
        },
        select: false
  }
});
const NewsModel = mongoose.model('newsmodel', newsSchema, 'newsentries');

UserSchema.statics.upsertFbUser = function (accessToken, refreshToken, profile, cb) {
  const that = this;
  console.log(accessToken);
  return this.findOne({
    'facebookProvider.id': profile.id
  }, function (err, user) {
    if (!user) {
      console.log(profile);
      var newUser = new that({
        email: profile.emails[0].value,
        facebookProvider: {
          id: profile.id,
          token: accessToken
        }
      });

      newUser.save(function (error, savedUser) {
        if (error) {
          console.log(error);
        }
        return cb(error, savedUser);
      });
    } else {
      return cb(err, user);
    }
  });
};

const User = mongoose.model('User', UserSchema);

app.use(bodyParser.json());

isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
      return next();

  res.sendStatus(401);
}

app.get('/', isLoggedIn, (req, res) => {
  const id = req.query.id;
  if (id) {
    NewsModel.findOne({ _id: id }, (err, entry) => {
      if (err || entry.length <= id) {
        throw new Error(err.message);
      }
      res.send(entry);
      logger.log({
        level: 'info',
        message: 'entry returned',
        timestamp: new Date()
      });
    });    
  } else {
    NewsModel.find({}, (err, news) => {      
      res.send(news);
      logger.log({
        level: 'info',
        message: 'file returned',
        timestamp: new Date()
      });
    });
  }
});

app.post('/', isLoggedIn, (req, res) => {
  const newEntry = req.body;
  if (!(newEntry.title && newEntry.description)) {
    logger.log({
      level: 'error',
      message: 'invalid format',
      timestamp: new Date()
    });
    throw new Error('invalid format');
  }
  const entry = new NewsModel(newEntry);
  entry.save();
  res.send('entry uploaded');
  logger.log({
    level: 'info',
    message: 'entry uploaded',
    timestamp: new Date()
  });
});

app.delete('/', isLoggedIn, (req, res) => {
  const id = req.query.id;
  NewsModel.deleteOne({ _id: id }, (err) => {
    if (err) {
      logger.log({
        level: 'error',
        message: 'entry not found',
        timestamp: new Date()
      });
      throw new Error(err.message);
    } else {
      res.send('entry deleted');
      logger.log({
        level: 'info',
        message: 'entry deleted',
        timestamp: new Date()
      });
    }
  });
});

app.put('/', isLoggedIn, (req, res) => {
  var newEntry = req.body;
  if (!(newEntry.title && newEntry.description)) {
    logger.log({
      level: 'error',
      message: 'invalid format',
      timestamp: new Date()
    });
    throw new Error('invalid format');
  }
  var id = req.query.id;
  NewsModel.updateOne({ _id: id}, newEntry, (err) => {
    if (err) {
      logger.log({
        level: 'error',
        message: 'element doesn\'t exist',
        timestamp: new Date()
      });
      throw new Error('element with specified id doesn\'t exist');
    } else {
      res.send('entry changed');
      logger.log({
        level: 'info',
        message: 'entry changed',
        timestamp: new Date()
      });
    }
  });  
});

app.get("/auth/facebook", passport.authenticate("facebook", { scope : "email" }));

app.get("/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect : "/",
        failureRedirect : "/500",
        
}));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use(function(err, req, res) {
  console.error(err);
  res.status(500).send(err.message);
});

app.use(session);
app.use(passport.initialize());