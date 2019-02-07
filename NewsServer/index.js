require('dotenv').load();
const express = require('express');
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
passport.use(new Strategy({
  clientID: process.env['FACEBOOK_CLIENT_ID'],
  clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
  callbackURL: '/return'
},
function (accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
})
);
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
const ObjectId = mongoose.Schema.Types.ObjectId;

const newsSchema = new mongoose.Schema({
  author: String,
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: String,
});
const NewsModel = mongoose.model('newsmodel', newsSchema, 'newsentries');

app.use(bodyParser.json());

app.get('/', (req, res) => {
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

app.post('/', (req, res) => {
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

app.delete('/', (req, res) => {
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

app.put('/', (req, res) => {
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use(function(err, req, res) {
  console.error(err.stack);
  res.status(500).send(err.message);
});
