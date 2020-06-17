require("dotenv").config();
const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {

    jwt.verify( req.headers.token , process.env.JWT_SECRET , (err,decoded)=>{
        if(err){
            return res.send("Token invalido.")
        }
        req.decoded = decoded
        return next();
    })

}