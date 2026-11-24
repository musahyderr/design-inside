// A stand-in for a framework dev server (Vite, Next…): serves a folder on a port,
// and answers WebSocket upgrades the way a hot-reload channel would.
//   node test/fixtures/devserver.cjs <folder> <port>
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const [dir, port] = process.argv.slice(2);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const p = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/$/, '/index.html'));
  if (!p.startsWith(path.resolve(dir)) || !fs.existsSync(p)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
server.on('upgrade', (req, socket) => {
  const accept = crypto.createHash('sha1').update(req.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);
  socket.write(Buffer.from([0x81, 5, ...Buffer.from('hello')])); // one text frame: "hello"
});
server.listen(+port, '127.0.0.1');
