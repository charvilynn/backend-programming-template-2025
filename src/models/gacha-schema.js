const mongoose = require('mongoose');

const gachaSchema = new mongoose.Schema({
  userName: String,
  prize: String, // nama hadiah atau null
  isWin: Boolean,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gacha', gachaSchema);
