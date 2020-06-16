const express = require("express");
const tweetsController = require("../controllers/tweetsController");
const router = express.Router();

router.get("/tweets", tweetsController.tweets);

router.get("/users", tweetsController.users);

router.get("/myTweets", tweetsController.myTweets);

router.get("/home", tweetsController.home);

module.exports = router;
