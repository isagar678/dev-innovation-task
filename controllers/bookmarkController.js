const Bookmark = require('../models/Bookmark');
const axios = require('axios');
const { isWebUri } = require('valid-url');

// Helper to fetch title from URL
async function fetchTitleFromUrl(url) {
  try {
    const response = await axios.get(url);
    const match = response.data.match(/<title>(.*?)<\/title>/i);
    return match ? match[1] : '';
  } catch {
    return '';
  }
}

// Create a new bookmark
exports.createBookmark = async (req, res) => {
  try {
    let { url, title, description, tags } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required.' });
    }
    if (!isWebUri(url)) {
      return res.status(400).json({ error: 'Invalid URL.' });
    }
    if (!title || title.trim() === '') {
      title = await fetchTitleFromUrl(url) || 'Untitled';
    }
    const bookmark = new Bookmark({ url, title, description, tags, user: req.user.userId });
    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Get all bookmarks (with optional search and tag filter)
exports.getBookmarks = async (req, res) => {
  try {
    const { q, tags } = req.query;
    let filter = { user: req.user.userId };
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { url: { $regex: q, $options: 'i' } }
      ];
    }
    if (tags) {
      const tagArr = tags.split(',');
      filter.tags = { $in: tagArr };
    }
    const bookmarks = await Bookmark.find(filter).sort({ updatedAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Get a single bookmark by ID
exports.getBookmarkById = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.id, user: req.user.userId });
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found.' });
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Update a bookmark by ID
exports.updateBookmark = async (req, res) => {
  try {
    let { url, title, description, tags } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required.' });
    }
    if (!isWebUri(url)) {
      return res.status(400).json({ error: 'Invalid URL.' });
    }
    if (!title || title.trim() === '') {
      title = await fetchTitleFromUrl(url) || 'Untitled';
    }
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { url, title, description, tags },
      { new: true, runValidators: true }
    );
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found.' });
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Delete a bookmark by ID
exports.deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found.' });
    res.json({ message: 'Bookmark deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}; 