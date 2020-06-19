const { Tweet, User } = require("../data/models");

module.exports = {
  allUsers(req, res, next) {
    Promise.all([User.find().sort({ createdAt: "desc" }).exec()])
      .then(([users]) => {
        res.json({ users });
      })
      .catch(next);
  },
  userData(req, res) {

    let username = req.query.username;
    isUndefined(username,"username",res)

    User.findOne({username:username})
    .then((user)=>{
      isUndefined(user,username,res)
      res.json(user)
    })
  },
  userUpdate(req, res) {

    let username = req.body.username;
    let newUserData = req.body.newUserData;

    if(newUserData.username || newUserData._id )
    { return res.json({error:`Usted está intentando modificar un dato que no tiene permitido.`})}

    User.updateOne({username:username},newUserData)
    .then((response)=>{
      res.json(response)
    })
  }
};

const isUndefined = (element,elementName,res) => {
  if(!element){
    return res.json({error:`${elementName} es invalide. ${element}`})
  }
}