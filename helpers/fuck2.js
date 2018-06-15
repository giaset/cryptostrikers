const packs = require('./fuck.json');
const countForCard = {};
const tierCounts = [];
packs.forEach(pack => {
  if (new Set(pack).size < pack.length) {
    console.log('DUPLICATE:', pack);
  }
  const countForTier = [0, 0, 0, 0];
  pack.forEach(card => {
    if (countForCard[card]) {
      countForCard[card]++;
    } else {
      countForCard[card] = 1;
    }

    if (card < 4) {
      countForTier[1]++;
    } else if (card < 20) {
      countForTier[2]++;
    } else if (card < 50) {
      countForTier[3]++;
    } else if (card >= 100) {
      countForTier[0]++;
    }
  });
  tierCounts.push(countForTier.join(''));
});

console.log(countForCard);

const countForTierCounts = {};
tierCounts.forEach(tierCount => {
  if (countForTierCounts[tierCount]) {
    countForTierCounts[tierCount]++;
  } else {
    countForTierCounts[tierCount] = 1;
  }
});

console.log(countForTierCounts);
