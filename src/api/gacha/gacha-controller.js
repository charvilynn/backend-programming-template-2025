const mongoose = require('mongoose');

const Gacha = mongoose.model('Gacha');
const Prize = mongoose.model('Prize');

// random hadiah
const getRandomPrize = (prizes) => {
  const available = prizes.filter((p) => p.winnersCount < p.quota);

  if (available.length === 0) return null;

  const random = Math.floor(Math.random() * available.length);
  return available[random];
};

// POST /gacha
exports.gacha = async (req, res) => {
  try {
    const { userName } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // cek batas 5x
    const count = await Gacha.countDocuments({
      userName,
      createdAt: { $gte: today },
    });

    if (count >= 5) {
      return res.status(400).json({
        message: 'Batas gacha hari ini sudah habis',
      });
    }

    const prizes = await Prize.find();
    const prize = getRandomPrize(prizes);

    let result;

    if (prize) {
      prize.winnersCount += 1;
      await prize.save();

      result = {
        isWin: true,
        prize: prize.name,
      };
    } else {
      result = {
        isWin: false,
        prize: null,
      };
    }

    // simpan histori
    await Gacha.create({
      userName,
      prize: result.prize,
      isWin: result.isWin,
    });

    return res.json(result);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

// GET history
exports.getHistory = async (req, res) => {
  const data = await Gacha.find({ userName: req.params.userName });
  return res.json(data);
};

// GET hadiah
exports.getPrizes = async (req, res) => {
  const data = await Prize.find();
  return res.json(data);
};

// GET winners (nama disamarkan)
exports.getWinners = async (req, res) => {
  const data = await Gacha.find({ isWin: true });

  const masked = data.map((d) => {
    const name = d.userName;
    const parts = name.split(' ');
    const maskedParts = parts.map((part) => {
      if (part.length <= 1) return part;
      return `${part[0]}${'*'.repeat(part.length - 1)}`;
    });
    return {
      userName: maskedParts.join(' '),
      prize: d.prize,
    };
  });

  return res.json(masked);
};

// POST /gacha/seed — isi data hadiah (jalankan sekali)
exports.seedPrizes = async (req, res) => {
  try {
    await Prize.deleteMany();
    await Prize.insertMany([
      { name: 'Emas 10 gram', quota: 1, winnersCount: 0 },
      { name: 'Smartphone X', quota: 5, winnersCount: 0 },
      { name: 'Smartwatch Y', quota: 10, winnersCount: 0 },
      { name: 'Voucher Rp100.000', quota: 100, winnersCount: 0 },
      { name: 'Pulsa Rp50.000', quota: 500, winnersCount: 0 },
    ]);
    return res.json({ message: 'Prizes berhasil di-seed!' });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
