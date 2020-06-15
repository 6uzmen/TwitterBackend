const { Tweet } = require("../data/models");

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
};
