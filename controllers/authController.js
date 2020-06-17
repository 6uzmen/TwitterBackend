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

    }
}