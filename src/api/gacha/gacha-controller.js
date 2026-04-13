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
    let name = d.userName;
    name = `${name[0]}***`;
    return {
      userName: name,
      prize: d.prize,
    };
  });

  return res.json(masked);
};
