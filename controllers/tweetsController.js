const { Tweet, User } = require("../data/models");

module.exports = {
  // GET: /api/tweets?skip={Number}&limit{Number}

  allTweets(req, res, next) {
    let { skip = 0, limit = 100 } = req.query;

    skip = Number(skip);
    limit = Number(limit);

    Promise.all([
      Tweet.find().sort({ createdAt: "desc" }).populate("author").exec(),
      Tweet.countDocuments(),
    ])
      .then(([tweets, total]) => {
        res.set("Access-Control-Allow-Origin", "*");
        res.json({ tweets, hasMore: skip + limit < total });
      })
      .catch(next);
  },

  createTweet(req, res) {
    const { username, content } = req.body;

    if (!username) {
      return res.status(400).json({ error: "username missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "content missing" });
    }

    User.findOne({ username: username }).then((user) => {
      newTweet = new Tweet({
        content: content,
        author: user,
        likes: 0,
        createdAt: Date.now(),
      });
      newTweet.save((err, savedTweet) => {
        if (err) {
          return res.json({
            error: `Ah ocurrido un error al crear el tweet. ${err}`,
          });
        }
        return res.json(savedTweet);
      });
    });
  },

  userTweets(req, res, next) {
    let username = req.query.username;
    let page = !req.query._page ? 0 : req.query._page;
    let limit = !req.query._limit ? 10 : req.query._limit;

    page = Number(page);
    limit = Number(limit);

    isUndefined(username, "Username", res);

    Promise.all([User.findOne({ username })]).then(([userData]) => {
      Promise.all([
        Tweet.find({ author: userData })
          .sort({ createdAt: "desc" })
          .skip(page * limit)
          .limit(limit),
      ])
        .then(([tweets, total]) => {
          res.json({ tweets, hasMore: page + limit < total });
        })
        .catch(next);
    });
  },
  followingTweets(req, res) {
    let username = req.query.username;
    let page = !req.query._page ? 0 : req.query._page;
    let limit = !req.query._limit ? 10 : req.query._limit;
    let followersTweets = [];

    page = Number(page);
    limit = Number(limit);

    isUndefined(username, "Username", res);

    User.findOne({ username }).then((userData) => {
      isUndefined(userData, "La informacion del usuario", res);

      const getFollowersTweets = async () => {
        for (let i = 0; i < userData.following.length; i++) {
          await Tweet.find({ author: userData.following[i] })
            .sort({ createdAt: "desc" })
            .skip(page * limit)
            .limit(limit)
            .populate("author")
            .then((followerData) => {
              followersTweets = [...followersTweets, ...followerData];
            });
        }
      };

      getFollowersTweets().then(() => {
        //Sort tweets by Date
        followersTweets.sort(function (a, b) {
          return Date.parse(b.createdAt) - Date.parse(a.createdAt);
        });
        res.set("Access-Control-Allow-Origin", "*");
        res.send(followersTweets.slice(0, limit));
      });
    });
  },
};

const isUndefined = (element, elementName, res) => {
  if (!element) {
    return res.json({ error: `${elementName} es invalide. ${element}` });
  }}