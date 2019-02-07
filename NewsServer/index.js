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
// const db = mongoose.connection;

const newsSchema = new mongoose.Schema({
  // _id: ObjectId,
  author: String,
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: String,
});
const NewsModel = mongoose.model('newsmodel', newsSchema, 'newsentries');

// const ent = new NewsModel({
//   author: "BBC News",
//   title: "Hit US sitcom Modern Family to end",
//   "description": "The series, which stars Ed O’Neill and Sofia Vergara, has won 22 Emmy Awards during its run.",
//   "url": "http://www.bbc.co.uk/news/entertainment-arts-47148138",
//   "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_news/749A/production/_105505892_mediaitem105501071.jpg",
//   "publishedAt": "2019-02-06T15:48:42Z"
// });
// ent.save();

app.use(bodyParser.json());

this.readFile = () => {
  return JSON.parse(fs.readFileSync('cnbc-articles.json'));
};

this.writeFile = data => {
  fs.writeFileSync('cnbc-articles.json', JSON.stringify(data));
};

app.get('/', (req, res) => {
  const id = req.params['id'];
  if (id) {
    const entry = NewsModel.find({ _id: id });
    if (file.length <= id) {
      throw new Error('element doesn\'t exist');
    }
    res.send(entry);
    logger.log({
      level: 'info',
      message: 'entry returned',
      timestamp: new Date()
    });
  } else {
    NewsModel.find({}, (err, news) => {      
      res.send(news);
      logger.log({
        level: 'info',
        message: 'file returned',
        timestamp: new Date()
      })
    });
  }
});

app.post('/', (req, res) => {
  var newEntry = req.body;
  if (!(newEntry.title && newEntry.description)) {
    logger.log({
      level: 'error',
      message: 'invalid format',
      timestamp: new Date()
    });
    throw new Error('invalid format');
  }
  var data = this.readFile();
  data.push(newEntry);
  this.writeFile(data);
  res.send('entry uploaded');
  logger.log({
    level: 'info',
    message: 'entry uploaded',
    timestamp: new Date()
  });
});

app.delete('/', (req, res) => {
  var data = this.readFile(),
    id = req.param('id');
  if (data.length <= id) {
    logger.log({
      level: 'error',
      message: 'entry not found',
      timestamp: new Date()
    });
    throw new Error('element doesn\'t exist');
  }
  data.splice(id, 1);
  this.writeFile(data);
  res.send('entry deleted');
  logger.log({
    level: 'info',
    message: 'entry deleted',
    timestamp: new Date()
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
  var data = this.readFile();
  var id = req.param('id');
  if (data.length <= id) {
    logger.log({
      level: 'error',
      message: 'element doesn\'t exist',
      timestamp: new Date()
    });
    throw new Error('element with specified id doesn\'t exist');
  }
  data[id] = newEntry;
  this.writeFile(data);
  res.send('entry changed');
  logger.log({
    level: 'info',
    message: 'entry returned',
    timestamp: new Date()
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use(function(err, req, res) {
  console.error(err.stack);
  res.status(500).send(err.message);
});
