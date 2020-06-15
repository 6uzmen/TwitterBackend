const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  bio: String,
  profileImg: String,
  tweets: String,
  following: String,
  followers: String,
});

module.exports = model("User", userSchema);
