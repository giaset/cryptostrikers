import shuffle from 'shuffle-array';

export default function(featuredChecklistItem) {
  let cards;
  if (featuredChecklistItem) {
    cards = _unshuffledPremiumCards(featuredChecklistItem);
  } else {
    cards = _unshuffledStandardCards();
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    shuffle(cards);
    const groupedCards = _groupIntoFours(cards);
    const duplicatesFound = _checkForDuplicates(groupedCards);
    if (!duplicatesFound) {
      const packs = _convertToUint32(groupedCards);
      return packs;
    }
  }
}

function _checkForDuplicates(groups) {
  groups.forEach(group => {
    if (new Set(group).size < group.length) {
      return true;
    }
  });
  return false;
}

function _convertToUint32(groups) {
  return groups.map(group => {
    let pack = '';
    group.forEach(checklistId => {
      const binary = checklistId.toString(2);
      const paddedBinary = '00000000'.substr(binary.length) + binary;
      pack += paddedBinary;
    });
    return parseInt(pack, 2);
  });
}

function _groupIntoFours(array) {
  const groups = [];
  for (let i = 0; i < array.length; i+=4) {
    const group = [array[i], array[i+1], array[i+2], array[i+3]];
    groups.push(group);
  }
  return groups;
}

function _unshuffledPremiumCards(featuredChecklistItem) {
  const cards = [];
    for (let i = 0; i < 50; i++) {
      const count = _premiumCountForChecklistId(i);
      for (let j = 0; j < count; j++) {
        cards.push(i);
      }
    }

    for (let i = 0; i < 100; i++) {
      cards.push(featuredChecklistItem);
    }

    return cards;
}

function _premiumCountForChecklistId(id) {
  if (id < 4) {
    return 19;
  } else if (id < 20) {
    return 24;
  } else if (id < 50) {
    return 48;
  }
}

function _unshuffledStandardCards() {
  const cards = [];
  for (let i = 0; i < 100; i++) {
    const count = _standardCountForChecklistId(i);
    for (let j = 0; j < count; j++) {
      cards.push(i);
    }
  }

  return cards;
}

function _standardCountForChecklistId(id) {
  if (id < 4) {
    return 1;
  } else if (id < 20) {
    return 2;
  } else if (id < 50) {
    return 4;
  } else {
    return 8;
  }
}
