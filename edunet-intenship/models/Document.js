const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  content: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Document', DocumentSchema);
