const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;
process.env.NODE_ENV = 'production';

app.get('/', (req, res) => {
  id = req.param('id');
  var file = readFile()
  if (id) {
    if (file.length <= id) {
      res.status(404).send('element doesn\'t exist');
    }
    res.send(file[id]);
  } else {
    res.send(file);
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
    res.status(500).send('invalid format');
  }
  var data = readFile();
  data.push(newEntry);
  writeFile(data);
  res.send('entry uploaded');
});

app.delete('/', (req, res) => {
  var data = readFile();
  if (data.length <= id) {
    res.status(404).send('element doesn\'t exist');
  }
  data.splice(req.param('id'), 1);
  writeFile(data);
  res.send('entry deleted');
})

app.put('/', (req, res) => {
  var newEntry = JSON.parse(req.param('entry'));
  if (!(newEntry.title && newEntry.description)) {
    res.status(500).send('invalid format');
  }
  var data = readFile();
  if (data.length <= id) {
    res.status(404).send('element with specified id doesn\'t exist');
  }
  data[req.param('id')] = newEntry;
  writeFile(data);
  res.send('entry changed');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));