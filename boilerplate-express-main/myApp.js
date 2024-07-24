let express = require("express");
let app = express();
const path = require("path");

//Use body-parser to parse POST requests
const bodyParser = require("body-parser");
//middleware to parse post requests using body-parser
app.use(bodyParser.urlencoded({ extended: false }));

//console.log("Hello!", path.join(__dirname, "views", "index.html"));

//middleware to server static assets
app.use("/public", express.static(path.join(__dirname, "public")));

//Serve an HTML file
app.get("/home", (req, res) => {
  //const path = `${__dirname}/views/index.html`;
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

//Serve jSON on a specific route
app.get("/json", (req, res) => {
  const messageText = "Hello json";

  //read environment variables (setup in .env)
  let message =
    process.env.MESSAGE_STYLE === "uppercase"
      ? messageText.toUpperCase()
      : messageText;
  res.json({ message: message });
});

//implement root level Request Logger
const logger = (req, res, next) => {
  const method = req.method;
  const path = req.path;
  const ip = req.ip;

  console.log(`${method} ${path} - ${ip}`);

  next();
};
app.use("/", logger); //Use custom middleware logger

//Chain middleware to create a time server
app.get(
  "/now",
  (req, res, next) => {
    req.time = new Date().toString();
    next();
  },
  (req, res) => {
    res.json({ time: req.time });
  }
);

//get route parameter input (:word) from the client
app.get("/:word/echo", (req, res) => {
  const word = req.params.word;
  res.json({ echo: word });
});

//get query parameter input from the client
app.get("/name", (req, res) => {
  const { first, last } = req.query;
  res.json({ name: `${first} ${last}` });
});

//get data from POST requests
app.route("/name").post((req, res) => {
  const { first, last } = req.body;
  res.json({ name: `${first} ${last}` });
});

//list server on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
