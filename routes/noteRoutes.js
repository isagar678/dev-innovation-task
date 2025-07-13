const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const auth = require('../utils/authMiddleware');

router.post('/', auth, noteController.createNote);
router.get('/', auth, noteController.getNotes);
router.get('/:id', auth, noteController.getNoteById);
router.put('/:id', auth, noteController.updateNote);
router.delete('/:id', auth, noteController.deleteNote);

module.exports = router; 