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
      res.status(404).send('element doesn\'t exist');
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

app.post('/', (req, res) => {
  var newEntry = JSON.parse(req.param('entry'));
  if (!(newEntry.title && newEntry.description)) {
    logger.log({
      level: 'error',
      message: 'invalid format',
      timestamp: new Date()
    });
    res.status(500).send('invalid format');
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
    res.status(404).send('element doesn\'t exist');
    logger.log({
      level: 'error',
      message: 'entry not found',
      timestamp: new Date()
    });
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
    res.status(500).send('invalid format');
    logger.log({
      level: 'error',
      message: 'invalid format',
      timestamp: new Date()
    });
  }
  var data = readFile();
  var id = req.param('id');
  if (data.length <= id) {
    res.status(404).send('element with specified id doesn\'t exist');
    logger.log({
      level: 'error',
      message: 'element doesn\'t exist',
      timestamp: new Date()
    });
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