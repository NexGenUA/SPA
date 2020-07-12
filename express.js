const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(express.static('public'));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, console.log(`Node.js web server at port ${PORT} is running...`));
