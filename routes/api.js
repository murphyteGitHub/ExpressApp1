var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
require('./../models/models.js');
var Post = mongoose.model('Post');
router.use(function(req,res,next){
    if (req.method === 'GET'){
        // continue to the next middleware or request handler
        return next();
    }
    if (!req.isAuthenticated()){
        // user not authenticated, redirect to login
        return res.redirect('/#login');
    }
    return next();
});
// implementation...
router.route('/posts')
// returns all posts
    .get(function(req, res){
        Post.find(function(err,data){
            if (err){
                return res.send(500,err);
            }
            return res.send(data);
        });
        })
    .post(function(req,res){
        var post = new Post();
        post.text = req.body.text;
        post.username = req.body.username;
        post.save(function(err, post){
            if (err){
                return res.send(500,err);
            }
            return res.json(post);
        });
    });
router.route('/posts/:id')
    .put(function(req,res){
        Post.findById(req.params.id, function(err, post){
            if (err){
                return res.send(err);        
            }
            if (!post){
                return res.send({message: "post not found"});
            }
            post.username = req.body.created_by;
            post.text = req.body.text;
            post.save(function(err,post){
                if (err){
                    res.send(err);
                }
                res.json(post);
            });
        });
    })
    //return a particular post
    .get(function(req,res){
        Post.findById(req.params.id, function(err, post){
            if (err){
                return res.send(err);        
            }
            return res.json(post);
        });
    })
    // updates existing post
    .delete(function(req,res){
        Post.remove({_id: req.params.id},
        function(err){
            if (err){
                res.send(err);
            }
            res.json("deleted :(" + req.params.id + ")");
        });
    });

module.exports = router;