const { Schema, model } = require("mongoose");

const tweetSchema = new Schema({
  author: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = model("Tweet", tweetSchema);
