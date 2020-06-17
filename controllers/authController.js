module.exports  = {
    login(req,res){
        res.send(req.user)        
        //console.log(req.isAuthenticated()) 
    }
}