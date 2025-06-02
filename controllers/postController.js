const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = new Post({
            title,
            content,
            author: req.user.id
        });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: 'Could not create post', error: err.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get posts', error: err.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving post', error: err.message });
    }
};

// New function to get posts by user ID
exports.getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get user posts', error: err.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: 'Update failed', error: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Deletion failed', error: err.message });
    }
};
