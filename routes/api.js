const express = require("express");
const tweetsController = require("../controllers/tweetsController");
const router = express.Router();

router.get("/tweets", tweetsController.tweets);



module.exports = router;