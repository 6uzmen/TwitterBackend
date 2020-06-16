const { Tweet, User } = require("../data/models");

module.exports = {
  // GET: /api/tweets?skip={Number}&limit{Number}
  tweets(req, res, next) {
    let { skip = 0, limit = 20 } = req.query;

    skip = Number(skip);
    limit = Number(limit);

    Promise.all([
      Tweet.find()
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(limit)
        .populate("author")
        .exec(),
      Tweet.countDocuments(),
    ])
      .then(([tweets, total]) => {
        res.json({ tweets, hasMore: skip + limit < total });
      })
      .catch(next);
  },
  myTweets(req, res, next) {

    let username = req.query.username;
    let userId;
    let { skip = 0, limit = 20 } = req.query;

    skip = Number(skip);
    limit = Number(limit);

    Promise.all([User.findOne({ username })]).then(([userData]) => userId = userData._id);

    Promise.all([
      Tweet.find({author:userId})
      //   .sort({ createdAt: "desc" })
      //   .skip(skip)
      //   .limit(limit)
      //   .populate("author")
      //   .exec(),
      // Tweet.countDocuments(),
    ])
      .then(([tweets, total]) => {
        console.log(tweets);
        res.json({ tweets, hasMore: skip + limit < total });
        console.log(total + " a")
      })
      .catch(next);
  },
};
