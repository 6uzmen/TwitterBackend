require("dotenv").config();

const mongoose = require("mongoose");
const faker = require("faker");
const bcrypt = require('bcrypt');

const { User, Tweet } = require("./models");

const NUMBER_OF_USERS = 15;
const NUMBER_OF_TWEETS = 500;
const NUMBER_OF_FOLLOWERS = 45;

//passwd = hack
const users = [{
  firstName: "Marcus",
  lastName: "Sueco",
  username: "marcusss",
  password:  bcrypt.hashSync("hack", 10),
  email: "ha@academy.com",
  bio: "El profee",
  profileImg: faker.image.fashion(),
  followers: [],
  following: [],
}];
const tweets = [];

// Remove all documents from database, and then seed the database.
Promise.all([User.deleteMany(), Tweet.deleteMany()]).then(() => {
  // First, seed users.
  console.log("Hasheando passwords...")
  for (let i = 0; i < NUMBER_OF_USERS; i++) {
    
    const hashPassword = bcrypt.hashSync(faker.address.city(), 10);
    
    users.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      password: hashPassword,
      email: faker.internet.email(),
      bio: faker.hacker.phrase(),
      profileImg: faker.image.cats(),
      followers: [],
      following: [],
    });
  }

  //Create Users
  const userPromise = User.collection.insertMany(users);
  console.log("Cargando usuarios...");

  //On Users Created
  userPromise.then((users) => {
    console.log("Se cargaron los usuarios correctamente.");

    const usersId = Object.values(users.insertedIds);

    //Create Tweets
    for (let i = 0; i < NUMBER_OF_TWEETS; i++) {
      tweets.push({
        content: faker.hacker.phrase(),
        author: faker.random.arrayElement(usersId),
        likes: faker.random.number(),
        createdAt: faker.date.past(),
      });
    }

    const tweetPromise = Tweet.collection.insertMany(tweets);
    console.log("Cargando tweets...");

    tweetPromise.then(() => {
      console.log("Se cargaron los tweets correctamente.");
    });

    //Create Followers
    const followPromise = async () => {
        console.log("Cargando followers...");
      for (let i = 0; i < NUMBER_OF_FOLLOWERS; i++) {

        let follower = faker.random.arrayElement(usersId);
        let toFollow = faker.random.arrayElement(usersId);

        let isAlreadyFollowed = await User.findOne({_id:follower}).then((user)=> user.following)

        if(follower !== toFollow && !isAlreadyFollowed.includes(toFollow)){
        await User.updateOne({ _id: follower }, { $push:{following: toFollow }});
        await User.updateOne({ _id: toFollow }, { $push:{followers: follower }});
        }

      }
    };

    followPromise().then(() => {
      console.log("Se cargaron los followers correctamente.");
      mongoose.disconnect();
    });
    
  });
});
