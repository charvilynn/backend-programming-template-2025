const gachaService = require('./gacha-service');

// POST /gacha
exports.gacha = async (req, res) => {
  try {
    const { userName } = req.body;

    const result = await gachaService.doGacha(userName);

    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// GET history tapi sesuai usernamenya
exports.getHistory = async (req, res) => {
  try {
    const data = await gachaService.getHistory(req.params.userName);
    return res.json(data);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

// GET semua history
exports.getAllHistory = async (req, res) => {
  try {
    const data = await gachaService.getAllHistory();
    return res.json(data);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

// GET prizes
exports.getPrizes = async (req, res) => {
  try {
    const data = await gachaService.getPrizes();
    return res.json(data);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

// GET winners
exports.getWinners = async (req, res) => {
  try {
    const data = await gachaService.getWinners();
    return res.json(data);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
