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

        // If file exists, serve it directly
        res.writeHead(200, { "Content-Type": "application/octet-stream" });
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
