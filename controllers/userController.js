const { Tweet, User } = require("../data/models");

module.exports = {
    users(req, res, next) {
        Promise.all([User.find().sort({ createdAt: "desc" }).exec()])
          .then(([users]) => {
            res.json({ users });
          })
          .catch(next);
      },
}