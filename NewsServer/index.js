const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;

app.get('/', (req, res) => {
  id = req.param('id');
  console.log(id);
  if (id) {
    res.send(readFile()[id]);
  } else {
    res.send(readFile());
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
  var data = readFile();
  data.push(newEntry);
  writeFile(data);
  res.send('entry uploaded');
});

app.delete('/', (req, res) => {
  var data = readFile();
  data.splice(req.param('id'), 1);
  writeFile(data);
  res.send('entry deleted');
})

app.put('/', (req, res) => {
  var newEntry = JSON.parse(req.param('entry'));
  var data = readFile();
  data[req.param('id')] = newEntry;
  writeFile(data);
  res.send('entry changed');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));