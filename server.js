'use strict';

const http = require('http');
const fs = require('fs');
const mime = require('mime');
const routes = new Set(['/', '/list']);
const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {

    if (req.method === 'POST' && req.url === '/addtask') {
      req.on('data', data => {
        const id = `/task-${data}`;
        routes.add(id);
      });
      setTimeout(() => res.end('ok'), 1000);
    } else if (routes.has(req.url)) {
    res.setHeader('Set-Cookie', ['test2=cookies', 'form=post']);
    res.setHeader('Content-Type', 'text/html');
    fs.ReadStream(__dirname + '/public/index.html').pipe(res);
  } else {
    fs.readFile('./public/' + req.url, err => {
      if (!err) {
        const mimeType = mime.getType(req.url) || 'text/plain';
        res.setHeader('Content-type', mimeType);
        fs.ReadStream(__dirname + '/public/' + req.url).pipe(res);
      } else {
        if (req.url === '/favicon.ico') {
          res.writeHead(404, 'Not Found');
          res.end();
        }
        res.writeHead(404, 'Not Found');
        fs.ReadStream(__dirname + '/public/index.html').pipe(res);
      }
    });
  }
});

server.listen(PORT);

console.log('Node.js web server at port 5000 is running..');
