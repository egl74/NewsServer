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
  fs.writeFileSync('cnbc-articles.json', data);
}

app.post('/', (req, res) => {
  var newEntry = req.param('entry');
  var data = readFile();
  data.push(newEntry);
  writeFile(JSON.stringify(data));
  res.send('entry uploaded');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));