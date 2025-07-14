const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const auth = require('../utils/authMiddleware');

router.post('/', auth, bookmarkController.createBookmark);
router.get('/', auth, bookmarkController.getBookmarks);
router.get('/:id', auth, bookmarkController.getBookmarkById);
router.put('/:id', auth, bookmarkController.updateBookmark);
router.delete('/:id', auth, bookmarkController.deleteBookmark);
router.patch('/:id/favorite', auth, bookmarkController.toggleFavorite);

module.exports = router; 