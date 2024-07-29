require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI);

//create person schema
const personSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
  favoriteFoods: [String],
});

//create Person model based on personSchema
let Person = mongoose.model("Person", personSchema);

const createAndSavePerson = (done) => {
  const john = new Person({
    name: "John Corner",
    age: 19,
    favoriteFoods: ["apple", "bannana", "Oats"],
  });

  john
    .save()
    .then((data) => done(null, data))
    .catch((error) => done(error));

  //Callback syntax is deprecated
  // john.save((err, data) => {
  //   if(err!=null) return done(err);
  //   done(null, data);
  // });
  //done(null /*, data*/);
};

const createManyPeople = (arrayOfPeople, done) => {
  //done(null /*, data*/);
  Person.create(arrayOfPeople)
    .then((data) => done(null, data))
    .catch((error) => done(error));
};

const findPeopleByName = (personName, done) => {
  //done(null /*, data*/);
  Person.find({ name: personName })
    .then((data) => done(null, data))
    .catch((error) => done(error));
};

const findOneByFood = (food, done) => {
  //done(null /*, data*/);
  Person.findOne({favoriteFoods: foodName})
    .then(data => {
      //console.log(`findOneByFood ${foodName}`, data);
      done(null, data);
    })
    .catch(error => done(error));
};

const findPersonById = (personId, done) => {
  done(null /*, data*/);
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  done(null /*, data*/);
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  done(null /*, data*/);
};

const removeById = (personId, done) => {
  done(null /*, data*/);
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  done(null /*, data*/);
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  done(null /*, data*/);
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
