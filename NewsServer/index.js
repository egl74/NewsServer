require('dotenv').load();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const https = require('https');
const fs = require('fs');
const Strategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const app = express();
var cors = require('cors');
app.use(cors());
const MongoStore = require('express-mongoose-store')(session, mongoose);
passport.use('facebook', new Strategy({
    clientID: process.env['FACEBOOK_CLIENT_ID'],
    clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'first_name', 'middle_name', 'last_name']
  },
  function (accessToken, refreshToken, profile, done) {
    User.upsertFbUser(accessToken, refreshToken, profile, function (err, user) {
      return done(err, user);
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
app.use(session({
  secret: 'secrettexthere',
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({
    collection: 'sessions',
    ttl: 60000
  })
}));
app.use(passport.initialize());
app.use(passport.session());
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
const bodyParser = require('body-parser');
const port = 3000;
const logger = createLogger({
  format: combine(label(), timestamp(), prettyPrint()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' })
  ]
});
mongoose.connect('mongodb://127.0.0.1:27017/news', {
  useNewUrlParser: true
});

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
    type: String,
    required: true,
    trim: true,
    unique: true,
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
  return this.findOne({
    'facebookProvider.id': profile.id
  }, function (err, user) {
    if (!user) {
      console.log('profile');
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
  // if (req.isAuthenticated())
  //   return next();

  // res.redirect('/auth/facebook');
  return next();
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
      news.sort((x, y) => 
        y.publishedAt.localeCompare(x.publishedAt)
      );
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
  res.send({message: 'entry uploaded', newsEntity: entry});
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
      res.send({message: 'entry deleted'});
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
      res.send({message: 'entry changed', newsEntity: newEntry});
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

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(port, () => console.log(`News app listening on port ${port}!`));

app.use(function(req, res, next) {
  res.status(500).send();
});
