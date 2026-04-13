const mongoose = require('mongoose');

const PrizeSchema = new mongoose.Schema({
  name: String,
  quota: Number,
  winnersCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Prize', PrizeSchema);
