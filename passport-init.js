var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

module.exports = function(passport){
    // Passport needs to be able to serialize and deserialize users to support persistence
    passport.serializeUser(function(user, done){
        console.log('serializing user:', user._id);
        return done(null, user._id);
    });
    // Deserialize user will call with the unique id provided by serialize user
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            if (err){
                return done(err);
            }
            if (!user){
                return done(null,false,{message: 'User not found'});
            }
            //we found the user. provide it back to passport
            return done(null,user);
        });        
    });
    passport.use('login',new LocalStrategy({
        passReqToCallback : true
    }, 
    function(req, username, password, done){
        User.findOne({username:username}, function(err, user){
            if (err){
                return done(err);
            }
            if (!user)
                return done(null,false,{message: 'User ' + username + ' not found'});
            
            if (!isValidPassword(user, password)){
                return done(null,false,{message: 'Invalid password.'});
            }
            // successfully signed in
            console.log('successfully signed in');
            return done(null,user);
        });
    }
    ));
    passport.use('signup', new LocalStrategy({
        passReqToCallback : true // allows passing back the entire request to the callback
    },
    function(req,username,password,done){ 
        console.log("in signup method. username = " + username + ". password = " + password + ".");

        // check if user exists
        User.findOne({username:username}, function(err, user){
            if (err){
                console.log("error in lookup user " + err);
                return done(err);                
            }
            if (user){
                console.log("username already exists");
                return done(null,false,{message: 'username already taken'});
            }
        // add user
            var user =  new User();
            user.username = username;
            user.password = createHash(password);
            user.save(function(err,user){
                if (err){
                    console.log("error saving user: " + err);
                    return done(err);
                }
                console.log(user.username + " registration succeeded.");
                return done(null, user, {message: 'Welcome!'});
            });
        });
    }));
    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10),null);
    }
}