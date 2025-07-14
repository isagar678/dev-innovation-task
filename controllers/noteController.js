const Note = require('../models/Note');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }
    const note = new Note({ title, content, tags, user: req.user.userId });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Get all notes (with optional search and tag filter)
exports.getNotes = async (req, res) => {
  try {
    const { q, tags } = req.query;
    let filter = { user: req.user.userId };
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ];
    }
    if (tags) {
      const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean);
      filter.tags = { $elemMatch: { $regex: tagArr.join('|'), $options: 'i' } };
    }
    if (req.query.favorite === 'true') filter.favorite = true;
    const notes = await Note.find(filter).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Get a single note by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.userId });
    if (!note) return res.status(404).json({ error: 'Note not found.' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Update a note by ID
exports.updateNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, content, tags },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ error: 'Note not found.' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Delete a note by ID
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!note) return res.status(404).json({ error: 'Note not found.' });
    res.json({ message: 'Note deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Toggle favorite status
exports.toggleFavorite = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.userId });
    if (!note) return res.status(404).json({ error: 'Note not found.' });
    note.favorite = !note.favorite;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}; 