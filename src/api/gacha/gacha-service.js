const gachaRepository = require('./gacha-repository');

// ambil hadiah random dari database yang quota-nya masih ada
const getRandomPrize = (prizes) => {
  const available = prizes.filter((p) => p.winnersCount < p.quota);

  if (available.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
};

// fungsi masking nama pemenang
const maskName = (name) => {
  if (!name || typeof name !== 'string') {
    return 'Anonymous';
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    return 'Anonymous';
  }

  const parts = trimmedName.split(/\s+/);

  return parts
    .map((part) => {
      if (part.length === 1) return '*';
      if (part.length === 2) return `${part[0]}*`;

      return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
    })
    .join(' ');
};

// proses gacha
async function doGacha(userName) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await gachaRepository.countTodayGacha(userName, today);

  if (count >= 5) {
    throw new Error('Batas gacha hari ini sudah habis');
  }

  const prizes = await gachaRepository.getAllPrizes();

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

// daftar hadiah + sisa quota
async function getPrizes() {
  const data = await gachaRepository.getAllPrizes();

  return data.map((p) => ({
    name: p.name,
    quota: p.quota,
    winnersCount: p.winnersCount,
    remainingQuota: p.quota - p.winnersCount,
  }));
}

// daftar pemenang dengan nama disamarkan
async function getWinners() {
  const data = await gachaRepository.getAllHistory();

  return data
    .filter((d) => d.isWin === true && d.prize)
    .map((d) => ({
      userName: maskName(d.userName),
      prize: d.prize,
    }));
}

module.exports = {
  doGacha,
  getHistory,
  getAllHistory,
  getPrizes,
  getWinners,
};
