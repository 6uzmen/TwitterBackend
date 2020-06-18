const { Tweet, User } = require("../data/models");

module.exports = {
  // GET: /api/tweets?skip={Number}&limit{Number}
  
  tweets(req, res, next) {
    let { skip = 0, limit = 100 } = req.query;

    skip = Number(skip);
    limit = Number(limit);

    Promise.all([
      Tweet.find()
        .sort({ createdAt: "desc" })
        .populate("author")
        .exec(),
      Tweet.countDocuments(),
    ])
      .then(([tweets, total]) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.json({ tweets, hasMore: skip + limit < total });
      })
      .catch(next);
  },
  createTweet(req,res,){

    let username = req.query.username;
    let content = req.query.content;

    isUndefined(username,"Username",res);
    isUndefined(content,"Content",res);

    User.findOne({username: username})
    .then()

  },
  userTweets(req, res, next) {

    let username = req.query.username;
    let page = !req.query._page ? 0 : req.query._page 
    let limit = !req.query._limit ? 10 : req.query._limit 

    page = Number(page);
    limit = Number(limit);

    isUndefined(username,"Username",res);

    Promise.all([User.findOne({ username })]).then(([userData]) => {
      Promise.all([
        Tweet.find({ author: userData })
          .sort({ createdAt: "desc" })
          .skip(page * limit)
          .limit(limit)
          .populate("author"),
      ])
        .then(([tweets, total]) => {
          res.json({ tweets, hasMore: page + limit < total });
        })
        .catch(next);
    });
  },
  followingTweets(req, res) {

    let username = req.query.username;
    let page = !req.query._page ? 0 : req.query._page 
    let limit = !req.query._limit ? 10 : req.query._limit 
    let followersTweets = [];

    page = Number(page);
    limit = Number(limit);

    isUndefined(username,"Username",res);

    User.findOne({ username }).then((userData) => {

      isUndefined(userData,"La informacion del usuario",res);

      const getFollowersTweets = async () => {
        for (let i = 0; i < userData.following.length; i++) {
          await Tweet.find({ author: userData.following[i] })
          .sort({ createdAt: "desc" })
          .skip(page * limit)
          .limit(limit)
          .populate("author")
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
         res.set('Access-Control-Allow-Origin', '*');
         res.send(followersTweets.slice(0,limit));
        
      });
      
    });
  },
};

  const isUndefined = (element,elementName,res) => {
    if(!element){
      return res.json({error:`${elementName} es invalide. ${element}`})
    }
  }
