let express = require("express");
let app = express();
const path = require("path");

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

//list server on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
