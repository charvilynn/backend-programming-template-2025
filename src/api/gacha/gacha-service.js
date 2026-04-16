const gachaRepository = require('./gacha-repository');

// random hadiah (ambil yang masih ada quota)
const getRandomPrize = (prizes) => {
  const available = prizes.filter((p) => p.winnersCount < p.quota);

  if (available.length === 0) return null;

  const random = Math.floor(Math.random() * available.length);
  return available[random];
};

// proses gacha
async function doGacha(userName) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!gachaRepository.countTodayGacha) {
    throw new Error('countTodayGacha tidak ditemukan di repository');
  }

  const count = await gachaRepository.countTodayGacha(userName, today);

  if (count >= 5) {
    throw new Error('Batas gacha hari ini sudah habis');
  }

  const prizes = await gachaRepository.getAllPrizes();

  // peluang menang (40%)
  const isWinChance = Math.random() < 0.4;

  let result;

  if (isWinChance) {
    const prize = getRandomPrize(prizes);

    if (prize) {
      prize.winnersCount += 1;
      await gachaRepository.updatePrize(prize);

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
  } else {
    result = {
      isWin: false,
      prize: null,
    };
  }

  // simpan history
  await gachaRepository.createGacha({
    userName,
    prize: result.prize,
    isWin: result.isWin,
  });

  return result;
}

// history sesuai username
async function getHistory(userName) {
  return gachaRepository.getHistoryByUser(userName);
}

// semua history
async function getAllHistory() {
  return gachaRepository.getAllHistory();
}

// get prizes
async function getPrizes() {
  const data = await gachaRepository.getAllPrizes();

  return data.map((p) => ({
    name: p.name,
    quota: p.quota,
    winnersCount: p.winnersCount,
    quotaRemaining: p.quota - p.winnersCount,
  }));
}

// get winners
async function getWinners() {
  const data = await gachaRepository.getAllHistory();

  return data
    .filter((d) => d.isWin)
    .map((d) => {
      const parts = d.userName.split(' ');
      const masked = parts.map((p) =>
        p.length <= 1 ? p : p[0] + '*'.repeat(p.length - 1)
      );

      return {
        userName: masked.join(' '),
        prize: d.prize,
      };
    });
}

module.exports = {
  doGacha,
  getHistory,
  getAllHistory,
  getPrizes,
  getWinners,
};
