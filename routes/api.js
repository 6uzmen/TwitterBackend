const express = require("express");
const {passport} = require('../config/passportConfig')
const tweetsController = require("../controllers/tweetsController");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

router.get("/tweets", tweetsController.tweets);

router.get("/users", tweetsController.users);

router.get("/userTweets", tweetsController.userTweets);

router.get("/home", tweetsController.home);

router.post("/login", passport.authenticate('local') , authController.login);

module.exports = router;
