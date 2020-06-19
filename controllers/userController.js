const { Tweet, User } = require("../data/models");

module.exports = {
    allUsers(req, res, next) {
        Promise.all([User.find().sort({ createdAt: "desc" }).exec()])
          .then(([users]) => {
            res.json({ users });
          })
          .catch(next);
      },

}