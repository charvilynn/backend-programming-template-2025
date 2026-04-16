const mongoose = require('mongoose');

const gachaSchema = new mongoose.Schema({
  userName: String,
  prize: String,
  isWin: Boolean,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gacha', gachaSchema);
