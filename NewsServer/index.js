const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;

app.get('/', (req, res) => {
  id = req.param('id');
  console.log(id);
  if (id) {
    res.send(JSON.parse(fs.readFileSync('cnbc-articles.json'))[id]);
  } else {
    res.send(JSON.parse(fs.readFileSync('cnbc-articles.json')));
  }
});

app.get('/');

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
