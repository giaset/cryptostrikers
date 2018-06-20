const fs = require('fs');

const FEATURED_CHECKLIST_ID = 110;

let cards;
while (true) {
  cards = [];
  for (let i = 0; i < 50; i++) {
    const count = countForChecklistId(i);
    for (let j = 0; j < count; j++) {
      cards.push(i);
    }
  }

  for (let i = 0; i < 100; i++) {
    cards.push(FEATURED_CHECKLIST_ID);
  }

  const packs = [];
  for (let i = 0; i < 500; i++) {
    const pack = newPack();

    if (!pack) {
      break;
    }

    packs.push(pack);
  }

  if (packs.length === 500) {
    packs.forEach(pack => {
      console.log(pack);
    });
    //fs.writeFileSync('./helpers/fuck.json', JSON.stringify(packs));
    break;
  }
}

function newPack() {
  const pack = [];
  let timeout = 0;
  while (true) {
    timeout++;
    if (timeout > 100) {
      // Put the cards back
      pack.forEach(card => {
        cards.push(card);
      });
      return null;
    }
    const index = Math.floor(Math.random() * cards.length);
    const card = cards[index];

    if (!pack.includes(card)) {
      cards.splice(index, 1);
      pack.push(card);
    }

    if (pack.length === 4) {
      return pack;
    }
  }
}

function countForChecklistId(id) {
  if (id < 4) {
    return 19;
  } else if (id < 20) {
    return 24;
  } else if (id < 50) {
    return 48;
  }
}
