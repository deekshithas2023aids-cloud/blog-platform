const express = require('express');

const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {

    const post = new Post(req.body);

    await post.save();

    res.json(post);
});

router.get('/', async (req, res) => {

    const posts = await Post.find();

    res.json(posts);
});

router.put('/:id', auth, async (req, res) => {

    const updated = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updated);
});

router.delete('/:id', auth, async (req, res) => {

    await Post.findByIdAndDelete(req.params.id);

    res.json({
        message: 'Post Deleted'
    });
});

router.post('/:id/comment', auth, async (req, res) => {

    const post = await Post.findById(req.params.id);

    post.comments.push(req.body);

    await post.save();

    res.json(post);
});

module.exports = router;