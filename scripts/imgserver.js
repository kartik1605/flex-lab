const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'images');
let pendingFilename = process.argv[2] || 'received.png';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://gemini.google.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Filename');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST') {
    const filename = req.headers['x-filename'] || pendingFilename;
    let body = Buffer.alloc(0);
    req.on('data', chunk => { body = Buffer.concat([body, Buffer.from(chunk.toString(), 'base64')]); });
    req.on('end', () => {
      const outPath = path.join(OUT, filename);
      fs.writeFileSync(outPath, body);
      console.log('Saved: ' + outPath + ' (' + body.length + ' bytes)');
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('saved:' + body.length);
      server.close();
      process.exit(0);
    });
    return;
  }

  res.writeHead(404); res.end('not found');
});

server.listen(9877, '127.0.0.1', () => {
  console.log('imgserver listening on http://127.0.0.1:9877 for ' + pendingFilename);
});

setTimeout(() => { console.log('timeout'); server.close(); process.exit(1); }, 120000);
