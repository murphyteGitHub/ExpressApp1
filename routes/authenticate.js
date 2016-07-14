var express = require('express');
var router = express.Router();

module.exports = function(passport){
    
    router.get('/success', function(req,res){
        res.send({user:{username: req.user.username}, message: 'Welcome, ' , state: 'success'});
    });
    
    router.get('/failure', function(req,res){
        res.send({ message: "Invalid username or password", state: 'failure'});
    });
    
    // log in
    router.post('/login',passport.authenticate('login',{
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));
    // sign up
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));
    // log out
    router.get('/signout',function(req,res){
        req.logout();
        res.redirect('/');
    });
    return router;
}