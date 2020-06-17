const express = require("express");

const tweetsController = require("../controllers/tweetsController");
const authController = require("../controllers/authController");
const jwtVerify = require("../middlewares/jwtVerify");

const router = express.Router();


router.get("/tweets", jwtVerify, tweetsController.tweets);

router.get("/users", jwtVerify, tweetsController.users);

router.get("/userTweets", jwtVerify, tweetsController.userTweets);

router.get("/home", jwtVerify, tweetsController.home);

router.post("/login", authController.login);

router.post("/register", authController.register)

module.exports = router;
