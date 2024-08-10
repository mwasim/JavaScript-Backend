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
        .then((exercise) => res.json(exercise))
        .catch((err) => res.status(400).json({ error: err.message }));
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

app.get("/api/users/:_id/logs", (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  User.findById(_id)
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });

      Exercise.find({ username: user.username })
        .where("date")
        .gte(from ? new Date(from) : new Date(0))
        .lte(to ? new Date(to) : new Date())
        .limit(parseInt(limit) || 0)
        .sort({ date: 1 })
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

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
