let cardCounts;
while (true) {
  cardCounts = { 106: 100 };
  for (let i = 0; i < 50; i++) {
    if (i < 4) {
      cardCounts[i] = 19;
    } else if (i < 20) {
      cardCounts[i] = 24;
    } else if (i < 50) {
      cardCounts[i] = 48;
    }
  }

  const packs = [];
  for (let i = 0; i < 500; i++) {
    const remainingCards = Object.keys(cardCounts);
    const pack = newPack(remainingCards);

    if (!pack) {
      break;
    }

    packs.push(pack);
  }

  if (packs.length > 495) {
    console.log(cardCounts);
    packs.forEach(pack => {
      console.log(pack);
    });
  }
}

function newPack(remainingCards) {
  const pack = [];
  let timeout = 0;
  while (true) {
    timeout++;
    if (timeout > 100) { return null };
    const index = Math.floor(Math.random() * remainingCards.length);
    const card = remainingCards[index];

    if (cardCounts[card] && cardCounts[card] > 0) {
      const intCard = parseInt(card);
      if (!pack.includes(intCard)) {
        pack.push(intCard);
        if (cardCounts[card] === 1) {
          cardCounts[card] = null;
        } else {
          cardCounts[card]--;
        }
      }

      if (pack.length === 4) {
        return pack;
      }
    }
  }
}
