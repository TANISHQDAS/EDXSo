const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8000;
const DIR = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".csv": "text/csv; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split("?")[0]);
  if (reqPath === "/" || reqPath === "") reqPath = "/index.html";

  const filePath = path.join(DIR, reqPath);

  // Security check: stay within DIR
  if (!filePath.startsWith(DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("File not found");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache"
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`EDXSO Operations Suite running locally at: http://localhost:${PORT}/`);
  console.log(`Interactive Dashboard: http://localhost:${PORT}/interactive_app.html`);
});
