const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  email: String,
  bio: String,
  profileImg: String,
  tweets: String,
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  ]
});

module.exports = model("User", userSchema);
