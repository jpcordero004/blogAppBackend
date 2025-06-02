// server/routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const {
    addComment,
    getCommentsByPost,
    deleteComment
} = require('../controllers/commentController');

const { protect } = require('../middleware/authMiddleware');

// Add a comment to a post
router.post('/:postId/comments', protect, addComment);

// Get all comments for a post
router.get('/:postId/comments', getCommentsByPost);

// Delete a comment (owner or admin)
router.delete('/comment/:id', protect, deleteComment);

module.exports = router;
