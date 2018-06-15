const shuffle = require('shuffle-array');

const featuredChecklistItem = 113;
const cards = _unshuffledPremiumCards(featuredChecklistItem);

while (true) {
  shuffle(cards);
  const groupedCards = _groupIntoFours(cards);
  const duplicatesFound = _checkForDuplicateIconics(groupedCards, featuredChecklistItem);
  if (!duplicatesFound) {
    let duplicatesCount = 0;
    groupedCards.forEach(group => {
      if (new Set(group).size < group.length) {
        duplicatesCount++;
      }
    });
    if (duplicatesCount <= 40) {
      console.log('Yooooooo:', duplicatesCount);
      groupedCards.forEach(group => {
        console.log(group);
      });
    }
  }
}

function _groupIntoFours(array) {
  const groups = [];
  for (let i = 0; i < array.length; i+=4) {
    const group = [array[i], array[i+1], array[i+2], array[i+3]];
    groups.push(group);
  }
  return groups;
}

function _checkForDuplicateIconics(groups, checklistItem) {
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const iconicCount = group.filter(x => x === checklistItem).length;
    if (iconicCount > 1) {
      return true;
    }
  }

  return false;
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
