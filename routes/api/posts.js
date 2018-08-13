const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Load Input Validation
const validatePostInput = require('../../validation/post');

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {
        errors,
        isValid
    } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    // Save
    newPost.save()
        .then(post => res.json(post));
});

// @route   GET api/posts
// @desc    get posts
// @access  Public
router.get('/', (req, res) => {
    Post.find()
        .sort({
            date: -1
        })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({
            nopostsfound: 'No posts found'
        }));
});

// @route   GET api/posts/:id
// @desc    get posts by id
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({
            nopostfound: 'No post found with that ID'
        }));
});

// @route   DELETE api/posts/:id
// @desc    delete posts by id
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // Check for post owner
                    if (post.user.toString() !== req.user.id) {
                        res.status(401).json({
                            notauthorized: 'User not authorized'
                        });
                    }

                    //Delete
                    post.remove()
                        .then(() => res.json({
                            success: true
                        }))
                        .catch(err => res.status(404).json({
                            postnotfound: 'No post found with that ID'
                        }));
                });
        });
});

// @route   POST api/posts/like/:post_id
// @desc    Like post
// @access  Private
router.post('/like/:post_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(porfile => {
            Post.findById(req.params.post_id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({
                            alreadyliked: 'User already liked this post'
                        });
                    }

                    // Add user id to the likes array
                    post.likes.unshift({
                        user: req.user.id
                    });

                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({
                    nopostfound: 'No post found'
                }));
        });
});

// @route   POST api/posts/unlike/:post_id
// @desc    UnLike post
// @access  Private
router.post('/unlike/:post_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(porfile => {
            Post.findById(req.params.post_id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({
                            notliked: 'You have not yet liked this post'
                        });
                    }

                    // Get remove index
                    const reovedIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                    // Splice out of array    
                    post.likes.splice(reovedIndex, 1);

                    // Save
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({
                    nopostfound: 'No post found'
                }));
        });
});

// @route   POST api/posts/comment/:post_id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:post_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {
        errors,
        isValid
    } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    Profile.findOne({
            user: req.user.id
        })
        .then(porfile => {
            Post.findById(req.params.post_id)
                .then(post => {

                    const newComment = {
                        text: req.body.text,
                        name: req.body.name,
                        avatar: req.body.avatar,
                        user: req.user.id,
                    };

                    //Add to comments array
                    post.comments.unshift(newComment);

                    // Save
                    post.save().then(post => res.json(post));

                })
                .catch(err => {
                    error.postnotfound = 'No post found';
                    res.status(404).json(errors);
                });
        });
});

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(porfile => {
            Post.findById(req.params.post_id)
                .then(post => {
                    // Check to see if comment exists
                    if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                        return res.status(400).json({
                            commnetnotexists: 'Comment dose not exists'
                        });
                    }

                    //Get remove index
                    const reovedIndex = post.comments
                        .map(item => item._id.toString())
                        .indexOf(req.params.comment_id);

                    // Splice out of array    
                    post.comments.splice(reovedIndex, 1);

                    // Save
                    post.save().then(post => res.json(post));

                })
                .catch(err => {
                    error.postnotfound = 'No post found';
                    res.status(404).json(errors);
                });
        });
});

module.exports = router;