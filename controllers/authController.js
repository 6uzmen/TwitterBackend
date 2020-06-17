require("dotenv").config();

const { User } = require("../data/models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports  = {
    login(req,res){

    let username = req.body.username;
    let password = req.body.password;

    User.findOne({username:username})
    .then((user)=> {

        if(user == null){
           return res.status(401).send("Algo ocurrio.")
        }
        
        bcrypt.compare(password,user.password)

        .then((result)=>{
            if(!result){
               return res.status(401).send("Algo ocurrio.")
            }

            const token = jwt.sign({username:user.username}, process.env.JWT_SECRET);
            return res.send(token)
            
        })

    })
    .catch((err)=>res.send(err))

    },
    register(req,res){
    
        let user = new User ({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password:  bcrypt.hashSync(req.body.password, 10),
            email: req.body.email,
            bio: req.body.bio,
            profileImg: req.body.profileImg,
            followers: [],
            following: [],
          })

        let username = req.body.username;

        User.findOne({username:username})
        .then((result)=>{
            if(result !== null){
               return res.send("Error")
            }
            user.save();
            res.send("Listo!")
        })
    }
}