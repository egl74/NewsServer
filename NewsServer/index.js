const express = require('express');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
const app = express();
const fs = require('fs');
const port = 3000;
const logger = createLogger({
  format: combine(
    label(),
    timestamp(),
    prettyPrint()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' })
  ]
});

app.get('/', (req, res) => {
  id = req.param('id');
  var file = readFile()
  if (id) {
    if (file.length <= id) {
      throw new Error('element doesn\'t exist');
    }
    res.send(file[id]);
    logger.log( {
      level: 'info',
      message: 'file returned',
      timestamp: new Date()
    });
  } else {
    res.send(file);
    logger.log({
      level: 'info',
      message: 'file returned',
      timestamp: new Date()
    });
  }
});

readFile = () => {
  return JSON.parse(fs.readFileSync('cnbc-articles.json'));
}

writeFile = data => {
  fs.writeFileSync('cnbc-articles.json', JSON.stringify(data));
}

app.post('/', (req, res, next) => {
  var newEntry = JSON.parse(req.param('entry'));
  if (!(newEntry.title && newEntry.description)) {
    logger.log({
      level: 'error',
      message: 'invalid format',
      timestamp: new Date()
    });
    throw new Error('invalid format');
  }
  var data = readFile();
  data.push(newEntry);
  writeFile(data);
  res.send('entry uploaded');
  logger.log({
    level: 'info',
    message: 'entry uploaded',
    timestamp: new Date()
  });
});

app.delete('/', (req, res) => {
  var data = readFile();
  if (data.length <= id) {
    logger.log({
      level: 'error',
      message: 'entry not found',
      timestamp: new Date()
    });
    throw new Error('element doesn\'t exist');
  }
  data.splice(req.param('id'), 1);
  writeFile(data);
  res.send('entry deleted');
  logger.log({
    level: 'info',
    message: 'entry deleted',
    timestamp: new Date()
  });
})

app.put('/', (req, res) => {
  var newEntry = JSON.parse(req.param('entry'));
  if (!(newEntry.title && newEntry.description)) {
    logger.log({
      level: 'error',
      message: 'invalid format',
      timestamp: new Date()
    });
    throw new Error('invalid format');
  }
  var data = readFile();
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
  writeFile(data);
  res.send('entry changed');
  logger.log({
    level: 'info',
    message: 'entry returned',
    timestamp: new Date()
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err.message);
});
