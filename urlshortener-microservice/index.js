require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
const { URL } = require("url");

//Use body-parser to parse POST requests
const bodyParser = require("body-parser");
//middleware to parse post requests using body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//// In-memory storage for the shortened URLs
let urlMap = {};
let nextId = 1;

// Endpoint to create a new shortened URL
app.route("/api/shorturl").post((req, res) => {
  const originalUrl = req.body.url;

  //validate the URL
  dns.lookup(new URL(originalUrl).hostname, (error) => {
    if (error) {
      return res.json({ error: "invalid url" });
    }

    //generate new short url id
    const shortId = nextId++;

    //store the mapping in the in-memory storage
    urlMap[shortId] = originalUrl;

    res.json({ original_url: originalUrl, short_url: shortId });
  });
});

// Endpoint to redirect from the short URL
app.get("/api/shorturl/:id", (req, res) => {
  const shortId = parseInt(req.params.id);
  const originalUrl = urlMap[shortId];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: "No short URL found for the given input" });
  }
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
