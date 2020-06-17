const { Tweet, User } = require("../data/models");

module.exports = {
  // GET: /api/tweets?skip={Number}&limit{Number}
  users(req, res, next) {
    Promise.all([User.find().sort({ createdAt: "desc" }).exec()])
      .then(([users]) => {
        res.json({ users });
      })
      .catch(next);
  },
  tweets(req, res, next) {
    let { skip = 0, limit = 100 } = req.query;

    skip = Number(skip);
    limit = Number(limit);

    Promise.all([
      Tweet.find()
        .sort({ createdAt: "desc" })
        //.skip(skip)
        //.limit(limit)
        .populate("author")
        .exec(),
      Tweet.countDocuments(),
    ])
      .then(([tweets, total]) => {
        res.json({ tweets, hasMore: skip + limit < total });
      })
      .catch(next);
  },
  userTweets(req, res, next) {

    let { username, skip = 0, limit = 20 } = req.query;

    skip = Number(skip);
    limit = Number(limit);

    Promise.all([User.findOne({ username })]).then(([userData]) => {
      Promise.all([
        Tweet.find({ author: userData })
          .sort({ createdAt: "desc" })
          .skip(skip)
          .limit(limit)
          .populate("author"),
      ])
        .then(([tweets, total]) => {
          res.json({ tweets, hasMore: skip + limit < total });
        })
        .catch(next);
    });
  },
  home(req, res, next) {

    let { username, limit = 20 } = req.query;

    limit = Number(limit);

    let followersTweets = [];

    User.findOne({ username }).then((userData) => {
      const getFollowersTweets = async () => {
        for (let i = 0; i < userData.following.length; i++) {
          await Tweet.find({ author: userData.following[i] })
          .limit(20)
          .then(
            (followerData) => {
              followersTweets = [...followersTweets, ...followerData];
            }
          );
        }
      };

      getFollowersTweets().then(() => {

        //Sort tweets by Date
        followersTweets.sort(
          function(a, b){
            return Date.parse(b.createdAt) - Date.parse(a.createdAt)
          });
              
         res.send(followersTweets.slice(0,limit));
        
      });
      
    });
  },
};
