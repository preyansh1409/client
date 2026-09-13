const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 8317;
const types = { 
  '.html': 'text/html', 
  '.css': 'text/css', 
  '.js': 'text/javascript', 
  '.json': 'application/json',
  '.md': 'text/markdown; charset=utf-8',
  '.yml': 'text/yaml',
  '.yaml': 'text/yaml',
  '.jpg': 'image/jpeg', 
  '.jpeg': 'image/jpeg', 
  '.png': 'image/png', 
  '.svg': 'image/svg+xml' 
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  let file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }

  try {
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      file = path.join(file, 'index.html');
    }
  } catch(e) {}

  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => console.log(`Serving http://localhost:${port}`));
