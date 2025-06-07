import { createServer } from "http";
import { parse } from "url";
import next from "next";
import fs from "fs";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    // if target is /scorms/* and the file exists, serve it directly
    if (parsedUrl.pathname.startsWith("/scorms/")) {
      const filePath = `./public${parsedUrl.pathname}`;
      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          // If file doesn't exist, continue to Next.js handler
          return handle(req, res, parsedUrl);
        }

        if (parsedUrl.pathname.endsWith(".html")) {
          res.writeHead(200, { "Content-Type": "text/html" });
        } else if (parsedUrl.pathname.endsWith(".js")) {
          res.writeHead(200, { "Content-Type": "application/javascript" });
        } else if (parsedUrl.pathname.endsWith(".css")) {
          res.writeHead(200, { "Content-Type": "text/css" });
        } else if (parsedUrl.pathname.endsWith(".json")) {
          res.writeHead(200, { "Content-Type": "application/json" });
        } else if (parsedUrl.pathname.endsWith(".png")) {
          res.writeHead(200, { "Content-Type": "image/png" });
        } else if (
          parsedUrl.pathname.endsWith(".jpg") ||
          parsedUrl.pathname.endsWith(".jpeg")
        ) {
          res.writeHead(200, { "Content-Type": "image/jpeg" });
        } else if (parsedUrl.pathname.endsWith(".svg")) {
          res.writeHead(200, { "Content-Type": "image/svg+xml" });
        } else if (
          parsedUrl.pathname.endsWith(".woff") ||
          parsedUrl.pathname.endsWith(".woff2")
        ) {
          res.writeHead(200, { "Content-Type": "font/woff" });
        } else if (parsedUrl.pathname.endsWith(".ttf")) {
          res.writeHead(200, { "Content-Type": "font/ttf" });
        } else if (parsedUrl.pathname.endsWith(".ico")) {
          res.writeHead(200, { "Content-Type": "image/x-icon" });
        } else {
          res.writeHead(200, { "Content-Type": "application/octet-stream" });
        }

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
      });
      return;
    }

    handle(req, res, parsedUrl);
  }).listen(port);

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );
});
