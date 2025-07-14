const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String }],
  favorite: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema); 