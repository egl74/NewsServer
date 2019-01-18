const express = require('express')
const app = express()
const fs = require("fs");
const port = 3000

app.get('/', (req, res) => res.send('Hello World!' + fs.readFileSync('cnbc-articles.json')))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))