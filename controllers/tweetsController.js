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
  myTweets(req, res, next) {
    let username = req.query.username;
    let { skip = 0, limit = 20 } = req.query;

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
    let username = req.query.username;
    let followersTweets = [];

    User.findOne({ username }).then((userData) => {
      const getFollowersTweets = async () => {
        for (let i = 0; i < userData.following.length; i++) {
          await Tweet.find({ author: userData.following[i] }).then(
            (followerData) => {
              followersTweets = [...followersTweets, ...followerData];
            }
          );
        }
      };

      getFollowersTweets().then(() => {

        let ordenados = false;

        while (!ordenados) {
          ordenados = true;

          for (var i = 0; i < followersTweets.length-1; i++) {
            if (Date.parse(followersTweets[i].createdAt) > Date.parse(followersTweets[i + 1].createdAt)) {

              ordenados = false;

              let temp = followersTweets[i];
              let temp2 = followersTweets[i + 1];

              followersTweets[i] = temp2;
              followersTweets[i + 1] = temp;
            }
          }
        }

         res.send(followersTweets);
        
      });
    });
  },
};
