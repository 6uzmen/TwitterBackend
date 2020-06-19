const express = require("express");

const tweetsController = require("../controllers/tweetsController");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const jwtVerify = require("../middlewares/jwtVerify");

const router = express.Router();

//Users

router.get("/allUsers", jwtVerify, userController.allUsers);

router.get("/userData", userController.userData);

router.patch("/userUpdate", userController.userUpdate);

//Tweets

router.get("/allTweets", tweetsController.allTweets);

router.post("/createTweet", tweetsController.createTweet);

router.get("/userTweets", tweetsController.userTweets);

router.get("/followingTweets", tweetsController.followingTweets);

//Auth

router.post("/login", authController.login);

router.post("/register", authController.register)

module.exports = router;
