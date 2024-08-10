const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Schemas
const exerciseSchema = new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date,
});
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
});

// Models
const Exercise = mongoose.model("Exercise", exerciseSchema);
const User = mongoose.model("User", userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.post("/api/users", (req, res) => {
  const { username } = req.body;
  const newUser = new User({ username });
  newUser
    .save()
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json({ error: err.message }));
});

app.post("/api/users/:_id/exercises", (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  User.findById(_id)
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });

      const newExercise = new Exercise({
        username: user.username,
        description,
        duration,
        date: date ? new Date(date) : new Date(),
      });

      newExercise
        .save()
        .then((exer) => {
          res.json({
            _id: user._id,
            username: user.username,
            date: exer.date.toDateString(),
            duration: exer.duration,
            description: exer.description,
          });
        })
        .catch((err) => res.status(400).json({ error: err.message }));
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

app.get("/api/users", (req, res) => {
  User.find({})
    .then((users) => {
      const usersArray = users.map((user) => ({
        username: user.username,
        _id: user._id,
      }));

      res.json(usersArray);
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

app.get("/api/users/:_id/logs", (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  // Validate input parameters
  if (from && !isValidDate(from)) {
    return res.status(400).json({ error: "Invalid 'from' date format" });
  }
  if (to && !isValidDate(to)) {
    return res.status(400).json({ error: "Invalid 'to' date format" });
  }
  if (limit && isNaN(limit)) {
    return res.status(400).json({ error: "Invalid 'limit' parameter" });
  }

  User.findById(_id)
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });

      const fromDate = from ? new Date(from) : new Date(0);
      const toDate = to ? new Date(to) : new Date();

      Exercise.find({ username: user.username })
        .where("date")
        .gte(fromDate)
        .lte(toDate)
        .limit(parseInt(limit) || 0)
        .sort({ date: 1 })
        .exec()
        .then((exercises) => {
          const log = exercises.map((exercise) => ({
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date.toDateString(),
          }));

          res.json({
            username: user.username,
            count: exercises.length,
            _id: user._id,
            log,
          });
        })
        .catch((err) => res.status(400).json({ error: err.message }));
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString) && !isNaN(Date.parse(dateString));
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
