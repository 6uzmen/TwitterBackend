const express = require("express");
const tweetsController = require("../controllers/tweetsController");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

router.get("/tweets", tweetsController.tweets);

router.get("/users", tweetsController.users);

router.get("/userTweets", tweetsController.userTweets);

router.get("/home", tweetsController.home);

router.post("/login", authController.login);

module.exports = router;
