const express = require("express");
const tweetsController = require("../controllers/tweetsController");
const router = express.Router();

router.get("/tweets", tweetsController.tweets);
router.get("/myTweets", tweetsController.myTweets);

module.exports = router;