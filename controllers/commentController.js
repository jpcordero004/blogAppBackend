// server/controllers/commentController.js
const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.postId;

        const comment = new Comment({
            text,
            author: req.user.id,
            post: postId
        });

        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add comment', error: err.message });
    }
};

exports.getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch comments', error: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete comment', error: err.message });
    }
};
