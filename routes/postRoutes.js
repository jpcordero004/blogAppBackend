const express = require('express');
const router = express.Router();
const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsByUser  // imported from controller
} = require('../controllers/postController');

const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Protected route to get posts by user ID
router.get('/user/:userId', protect, getPostsByUser);

// Protected routes for CRUD
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
