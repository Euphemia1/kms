require("dotenv").config(); // ⬅️ MUST be FIRST

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

// ❌ DO NOT force localhost in production
const hostname = dev ? "localhost" : "0.0.0.0";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("🔥 Server error:", err);
      res.statusCode = 500;
      res.end("Internal server error");
    }
  })
    .once("error", (err) => {
      console.error("❌ Server failed:", err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`✅ Ready on port ${port}`);
    });
});
