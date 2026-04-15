const mongoose = require('mongoose');

const Gacha = mongoose.model('Gacha');
const Prize = mongoose.model('Prize');

// ambil semua hadiah
async function getAllPrizes() {
  return Prize.find({});
}

// ambil history by user
async function getHistoryByUser(userName) {
  return Gacha.find({ userName }, { _id: 0, __v: 0 });
}

// ambil semua history
async function getAllHistory() {
  return Gacha.find({}, { _id: 0, __v: 0 });
}

// hitung gacha hari ini
async function countTodayGacha(userName, today) {
  return Gacha.countDocuments({
    userName,
    createdAt: { $gte: today },
  });
}

// simpan hasil gacha
async function createGacha(data) {
  return Gacha.create(data);
}

// update prize (winnersCount)
async function updatePrize(prize) {
  return prize.save();
}

module.exports = {
  getAllPrizes,
  getHistoryByUser,
  getAllHistory,
  countTodayGacha,
  createGacha,
  updatePrize,
};
