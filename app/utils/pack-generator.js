import shuffle from 'shuffle-array';

const PACKS = [[ 13, 48, 43, 113 ],
[ 21, 10, 39, 23 ],
[ 38, 113, 33, 21 ],
[ 11, 37, 21, 15 ],
[ 36, 29, 21, 4 ],
[ 40, 37, 6, 34 ],
[ 12, 29, 4, 33 ],
[ 36, 26, 48, 35 ],
[ 3, 48, 17, 22 ],
[ 25, 5, 38, 32 ],
[ 2, 34, 36, 37 ],
[ 21, 7, 41, 25 ],
[ 44, 41, 29, 8 ],
[ 1, 37, 14, 36 ],
[ 113, 44, 47, 34 ],
[ 32, 23, 30, 24 ],
[ 38, 35, 23, 32 ],
[ 44, 113, 16, 22 ],
[ 39, 31, 27, 28 ],
[ 28, 10, 19, 0 ],
[ 35, 39, 40, 29 ],
[ 49, 36, 20, 33 ],
[ 22, 26, 40, 5 ],
[ 27, 47, 113, 14 ],
[ 14, 11, 39, 38 ],
[ 24, 28, 41, 1 ],
[ 44, 41, 24, 18 ],
[ 40, 21, 48, 3 ],
[ 34, 29, 31, 45 ],
[ 35, 34, 42, 10 ],
[ 24, 33, 22, 30 ],
[ 21, 22, 14, 35 ],
[ 45, 31, 16, 44 ],
[ 33, 48, 23, 30 ],
[ 20, 44, 113, 22 ],
[ 38, 36, 35, 28 ],
[ 49, 29, 0, 43 ],
[ 32, 37, 34, 113 ],
[ 27, 25, 22, 42 ],
[ 46, 38, 43, 47 ],
[ 29, 12, 31, 38 ],
[ 19, 35, 5, 9 ],
[ 8, 47, 45, 0 ],
[ 39, 32, 23, 11 ],
[ 40, 49, 29, 45 ],
[ 41, 46, 32, 45 ],
[ 29, 48, 38, 45 ],
[ 42, 25, 36, 28 ],
[ 10, 3, 113, 37 ],
[ 45, 21, 32, 41 ],
[ 0, 33, 27, 40 ],
[ 17, 45, 18, 40 ],
[ 22, 28, 24, 26 ],
[ 12, 113, 7, 33 ],
[ 32, 12, 48, 36 ],
[ 24, 27, 38, 11 ],
[ 31, 45, 14, 34 ],
[ 32, 49, 34, 14 ],
[ 31, 36, 8, 12 ],
[ 20, 48, 15, 25 ],
[ 46, 6, 34, 29 ],
[ 23, 26, 25, 113 ],
[ 113, 17, 33, 43 ],
[ 34, 42, 13, 35 ],
[ 47, 113, 11, 41 ],
[ 5, 19, 39, 45 ],
[ 113, 25, 30, 47 ],
[ 38, 39, 28, 6 ],
[ 48, 16, 41, 12 ],
[ 26, 23, 47, 1 ],
[ 17, 41, 11, 10 ],
[ 35, 43, 20, 31 ],
[ 43, 19, 47, 36 ],
[ 23, 44, 33, 26 ],
[ 113, 34, 30, 38 ],
[ 113, 48, 36, 29 ],
[ 30, 20, 113, 23 ],
[ 43, 25, 35, 34 ],
[ 1, 39, 41, 42 ],
[ 26, 27, 30, 16 ],
[ 5, 26, 24, 44 ],
[ 47, 20, 5, 49 ],
[ 44, 19, 17, 4 ],
[ 46, 2, 38, 13 ],
[ 40, 18, 46, 1 ],
[ 23, 43, 16, 45 ],
[ 35, 26, 39, 20 ],
[ 38, 49, 113, 3 ],
[ 44, 26, 49, 22 ],
[ 8, 48, 41, 42 ],
[ 26, 45, 32, 21 ],
[ 46, 27, 7, 32 ],
[ 22, 25, 41, 6 ],
[ 27, 42, 7, 20 ],
[ 23, 43, 30, 33 ],
[ 25, 39, 46, 34 ],
[ 48, 18, 16, 29 ],
[ 40, 23, 11, 12 ],
[ 11, 6, 46, 21 ],
[ 26, 113, 35, 32 ],
[ 31, 37, 7, 113 ],
[ 39, 47, 31, 6 ],
[ 39, 12, 9, 21 ],
[ 31, 41, 18, 48 ],
[ 28, 23, 44, 24 ],
[ 46, 35, 3, 37 ],
[ 25, 14, 45, 26 ],
[ 18, 20, 28, 27 ],
[ 39, 35, 42, 22 ],
[ 46, 45, 48, 39 ],
[ 38, 33, 40, 46 ],
[ 11, 44, 21, 45 ],
[ 19, 4, 24, 41 ],
[ 36, 15, 8, 46 ],
[ 27, 33, 113, 36 ],
[ 27, 34, 38, 29 ],
[ 36, 113, 38, 9 ],
[ 12, 113, 20, 36 ],
[ 33, 19, 25, 1 ],
[ 113, 46, 33, 20 ],
[ 14, 35, 49, 13 ],
[ 25, 10, 113, 35 ],
[ 5, 29, 40, 42 ],
[ 27, 113, 32, 25 ],
[ 13, 21, 15, 30 ],
[ 12, 7, 113, 30 ],
[ 24, 26, 23, 16 ],
[ 25, 44, 45, 2 ],
[ 47, 36, 7, 26 ],
[ 7, 13, 4, 113 ],
[ 32, 4, 24, 43 ],
[ 27, 48, 46, 31 ],
[ 22, 35, 30, 16 ],
[ 25, 38, 113, 5 ],
[ 47, 48, 35, 17 ],
[ 22, 4, 49, 5 ],
[ 37, 28, 49, 15 ],
[ 18, 33, 22, 35 ],
[ 20, 21, 39, 40 ],
[ 113, 14, 48, 41 ],
[ 21, 24, 41, 37 ],
[ 37, 113, 20, 29 ],
[ 37, 49, 26, 40 ],
[ 42, 43, 22, 31 ],
[ 48, 28, 4, 5 ],
[ 23, 113, 30, 24 ],
[ 19, 28, 27, 46 ],
[ 28, 45, 39, 113 ],
[ 45, 34, 33, 21 ],
[ 17, 33, 40, 39 ],
[ 113, 28, 49, 8 ],
[ 5, 49, 21, 35 ],
[ 26, 43, 24, 37 ],
[ 24, 27, 25, 31 ],
[ 27, 37, 25, 10 ],
[ 27, 38, 24, 16 ],
[ 24, 6, 13, 17 ],
[ 36, 17, 47, 12 ],
[ 24, 48, 34, 38 ],
[ 10, 2, 33, 32 ],
[ 23, 38, 24, 44 ],
[ 24, 113, 26, 42 ],
[ 25, 44, 37, 20 ],
[ 7, 35, 37, 4 ],
[ 38, 30, 24, 40 ],
[ 48, 34, 23, 47 ],
[ 27, 1, 46, 9 ],
[ 28, 40, 11, 38 ],
[ 43, 15, 36, 48 ],
[ 19, 42, 15, 22 ],
[ 23, 43, 37, 21 ],
[ 42, 20, 12, 1 ],
[ 8, 113, 14, 41 ],
[ 43, 42, 26, 113 ],
[ 44, 14, 25, 42 ],
[ 24, 19, 13, 21 ],
[ 47, 21, 6, 48 ],
[ 38, 14, 49, 27 ],
[ 2, 29, 49, 24 ],
[ 21, 23, 42, 5 ],
[ 21, 47, 33, 41 ],
[ 20, 0, 21, 27 ],
[ 10, 113, 34, 43 ],
[ 30, 32, 44, 113 ],
[ 44, 33, 19, 20 ],
[ 44, 16, 30, 40 ],
[ 35, 31, 49, 113 ],
[ 5, 30, 31, 43 ],
[ 33, 13, 0, 3 ],
[ 43, 37, 40, 26 ],
[ 39, 46, 40, 27 ],
[ 44, 30, 33, 46 ],
[ 6, 38, 46, 40 ],
[ 43, 4, 21, 27 ],
[ 15, 39, 22, 26 ],
[ 20, 21, 29, 37 ],
[ 44, 48, 2, 28 ],
[ 26, 48, 28, 113 ],
[ 36, 44, 24, 46 ],
[ 36, 18, 46, 12 ],
[ 20, 26, 113, 35 ],
[ 21, 20, 16, 43 ],
[ 44, 26, 35, 4 ],
[ 30, 31, 6, 43 ],
[ 20, 48, 10, 37 ],
[ 40, 47, 113, 28 ],
[ 3, 113, 49, 6 ],
[ 32, 46, 1, 35 ],
[ 43, 29, 0, 45 ],
[ 39, 11, 46, 24 ],
[ 10, 33, 113, 40 ],
[ 35, 41, 43, 42 ],
[ 32, 47, 30, 42 ],
[ 49, 40, 1, 24 ],
[ 28, 36, 42, 6 ],
[ 22, 31, 27, 21 ],
[ 13, 113, 25, 7 ],
[ 27, 30, 49, 43 ],
[ 25, 21, 30, 113 ],
[ 23, 24, 38, 39 ],
[ 40, 113, 38, 48 ],
[ 113, 20, 35, 1 ],
[ 13, 15, 24, 26 ],
[ 12, 3, 13, 48 ],
[ 47, 23, 34, 20 ],
[ 22, 9, 20, 36 ],
[ 11, 30, 19, 7 ],
[ 11, 33, 4, 23 ],
[ 41, 28, 2, 113 ],
[ 23, 19, 13, 45 ],
[ 46, 40, 47, 37 ],
[ 113, 22, 5, 39 ],
[ 4, 36, 38, 29 ],
[ 17, 14, 38, 22 ],
[ 31, 10, 45, 29 ],
[ 49, 5, 2, 44 ],
[ 48, 30, 28, 7 ],
[ 34, 45, 27, 7 ],
[ 10, 20, 23, 48 ],
[ 36, 113, 42, 21 ],
[ 25, 1, 30, 42 ],
[ 44, 29, 26, 1 ],
[ 43, 25, 13, 36 ],
[ 20, 46, 43, 23 ],
[ 30, 45, 15, 47 ],
[ 44, 46, 25, 33 ],
[ 22, 23, 43, 18 ],
[ 32, 7, 22, 28 ],
[ 41, 14, 28, 113 ],
[ 20, 33, 15, 24 ]];

const PACKS2 = [[ 15, 113, 9, 7 ],
[ 39, 36, 49, 34 ],
[ 14, 21, 45, 29 ],
[ 27, 18, 113, 15 ],
[ 113, 46, 34, 48 ],
[ 38, 39, 46, 48 ],
[ 40, 44, 45, 42 ],
[ 10, 113, 31, 49 ],
[ 4, 113, 40, 33 ],
[ 28, 46, 38, 31 ],
[ 25, 17, 8, 21 ],
[ 113, 48, 30, 28 ],
[ 30, 34, 47, 32 ],
[ 4, 15, 2, 24 ],
[ 113, 35, 32, 41 ],
[ 4, 45, 113, 25 ],
[ 32, 24, 35, 37 ],
[ 2, 42, 29, 32 ],
[ 113, 34, 23, 41 ],
[ 12, 42, 41, 49 ],
[ 42, 48, 41, 46 ],
[ 30, 27, 41, 34 ],
[ 6, 113, 35, 31 ],
[ 28, 9, 46, 44 ],
[ 38, 37, 39, 8 ],
[ 35, 22, 26, 113 ],
[ 27, 28, 10, 32 ],
[ 34, 31, 8, 27 ],
[ 45, 6, 113, 46 ],
[ 43, 49, 45, 28 ],
[ 48, 4, 9, 0 ],
[ 35, 44, 18, 3 ],
[ 17, 14, 41, 39 ],
[ 49, 42, 37, 3 ],
[ 6, 44, 12, 2 ],
[ 28, 40, 25, 44 ],
[ 10, 39, 35, 9 ],
[ 33, 38, 26, 39 ],
[ 30, 11, 113, 22 ],
[ 31, 40, 6, 48 ],
[ 41, 43, 30, 17 ],
[ 32, 26, 47, 37 ],
[ 37, 9, 29, 113 ],
[ 25, 113, 29, 22 ],
[ 47, 22, 29, 26 ],
[ 27, 8, 7, 35 ],
[ 27, 33, 22, 28 ],
[ 44, 36, 41, 23 ],
[ 32, 45, 3, 41 ],
[ 19, 48, 24, 113 ],
[ 36, 10, 29, 48 ],
[ 27, 28, 41, 32 ],
[ 23, 19, 113, 47 ],
[ 20, 10, 0, 41 ],
[ 33, 17, 42, 46 ],
[ 12, 40, 46, 44 ],
[ 22, 31, 4, 34 ],
[ 113, 22, 27, 9 ],
[ 25, 36, 19, 24 ],
[ 28, 38, 43, 49 ],
[ 45, 35, 16, 2 ],
[ 43, 6, 7, 30 ],
[ 32, 46, 28, 35 ],
[ 45, 113, 36, 33 ],
[ 24, 23, 37, 6 ],
[ 47, 45, 11, 27 ],
[ 39, 32, 30, 37 ],
[ 43, 27, 30, 33 ],
[ 15, 30, 36, 2 ],
[ 6, 11, 42, 8 ],
[ 17, 6, 40, 48 ],
[ 11, 8, 44, 34 ],
[ 13, 25, 2, 18 ],
[ 49, 34, 113, 7 ],
[ 48, 21, 29, 38 ],
[ 39, 41, 31, 49 ],
[ 113, 39, 41, 29 ],
[ 16, 37, 29, 25 ],
[ 20, 5, 42, 45 ],
[ 1, 31, 24, 26 ],
[ 23, 18, 113, 4 ],
[ 14, 48, 49, 9 ],
[ 21, 45, 32, 35 ],
[ 45, 3, 40, 34 ],
[ 23, 47, 32, 8 ],
[ 20, 36, 47, 45 ],
[ 20, 24, 31, 32 ],
[ 6, 25, 20, 15 ],
[ 41, 43, 48, 33 ],
[ 16, 49, 33, 38 ],
[ 43, 24, 3, 40 ],
[ 14, 30, 42, 22 ],
[ 25, 9, 26, 1 ],
[ 23, 20, 49, 39 ],
[ 26, 21, 10, 42 ],
[ 24, 44, 40, 38 ],
[ 113, 49, 36, 42 ],
[ 21, 26, 16, 31 ],
[ 8, 25, 26, 19 ],
[ 22, 40, 16, 10 ],
[ 23, 49, 17, 46 ],
[ 7, 1, 34, 6 ],
[ 26, 20, 48, 15 ],
[ 26, 37, 1, 16 ],
[ 27, 28, 42, 29 ],
[ 20, 34, 32, 31 ],
[ 44, 34, 30, 113 ],
[ 26, 35, 18, 15 ],
[ 12, 2, 23, 41 ],
[ 113, 39, 36, 44 ],
[ 41, 5, 49, 12 ],
[ 32, 15, 35, 16 ],
[ 36, 26, 17, 44 ],
[ 34, 36, 24, 30 ],
[ 26, 32, 47, 37 ],
[ 24, 37, 7, 42 ],
[ 14, 23, 27, 45 ],
[ 42, 15, 31, 12 ],
[ 18, 34, 43, 10 ],
[ 34, 25, 26, 45 ],
[ 32, 22, 41, 30 ],
[ 3, 41, 31, 32 ],
[ 25, 23, 39, 1 ],
[ 113, 24, 31, 44 ],
[ 30, 18, 45, 47 ],
[ 32, 25, 17, 40 ],
[ 113, 38, 36, 20 ],
[ 26, 42, 18, 38 ],
[ 43, 42, 36, 22 ],
[ 17, 25, 34, 113 ],
[ 29, 11, 9, 43 ],
[ 16, 21, 29, 32 ],
[ 27, 8, 39, 0 ],
[ 17, 37, 19, 20 ],
[ 13, 8, 40, 22 ],
[ 38, 46, 25, 16 ],
[ 32, 113, 45, 37 ],
[ 29, 12, 31, 18 ],
[ 13, 34, 45, 49 ],
[ 13, 20, 3, 21 ],
[ 3, 43, 35, 45 ],
[ 23, 31, 41, 35 ],
[ 113, 15, 39, 27 ],
[ 31, 46, 25, 17 ],
[ 34, 46, 0, 47 ],
[ 36, 21, 10, 16 ],
[ 9, 4, 35, 41 ],
[ 42, 22, 38, 113 ],
[ 42, 13, 11, 47 ],
[ 35, 47, 34, 36 ],
[ 22, 28, 29, 36 ],
[ 41, 43, 24, 22 ],
[ 113, 40, 37, 32 ],
[ 44, 22, 0, 49 ],
[ 2, 39, 48, 21 ],
[ 8, 18, 49, 46 ],
[ 46, 20, 22, 47 ],
[ 22, 23, 0, 46 ],
[ 29, 43, 5, 11 ],
[ 35, 42, 39, 113 ],
[ 27, 113, 39, 14 ],
[ 46, 32, 25, 45 ],
[ 21, 30, 4, 39 ],
[ 8, 21, 35, 20 ],
[ 20, 42, 29, 28 ],
[ 47, 4, 9, 11 ],
[ 16, 33, 7, 15 ],
[ 38, 24, 34, 6 ],
[ 49, 29, 21, 38 ],
[ 113, 15, 12, 7 ],
[ 38, 20, 6, 8 ],
[ 21, 13, 24, 36 ],
[ 113, 8, 18, 37 ],
[ 40, 49, 29, 47 ],
[ 49, 48, 44, 113 ],
[ 0, 28, 30, 33 ],
[ 14, 33, 34, 48 ],
[ 16, 5, 20, 10 ],
[ 17, 24, 20, 31 ],
[ 33, 48, 12, 46 ],
[ 29, 37, 22, 9 ],
[ 29, 41, 18, 4 ],
[ 47, 113, 42, 23 ],
[ 47, 35, 5, 9 ],
[ 41, 21, 47, 19 ],
[ 29, 31, 37, 32 ],
[ 27, 44, 40, 36 ],
[ 8, 20, 43, 27 ],
[ 48, 49, 13, 25 ],
[ 28, 29, 46, 43 ],
[ 29, 23, 37, 42 ],
[ 33, 49, 42, 14 ],
[ 16, 18, 39, 45 ],
[ 113, 34, 37, 5 ],
[ 33, 47, 17, 39 ],
[ 23, 31, 43, 35 ],
[ 33, 9, 27, 42 ],
[ 25, 33, 32, 15 ],
[ 0, 39, 26, 23 ],
[ 32, 46, 113, 37 ],
[ 33, 39, 27, 37 ],
[ 27, 0, 47, 31 ],
[ 26, 43, 11, 25 ],
[ 13, 29, 3, 28 ],
[ 113, 40, 36, 44 ],
[ 42, 20, 8, 31 ],
[ 2, 0, 49, 41 ],
[ 33, 49, 8, 113 ],
[ 28, 36, 3, 47 ],
[ 31, 113, 40, 49 ],
[ 2, 38, 28, 22 ],
[ 37, 14, 47, 33 ],
[ 49, 31, 46, 38 ],
[ 37, 1, 29, 27 ],
[ 25, 42, 21, 37 ],
[ 0, 22, 47, 42 ],
[ 21, 10, 39, 9 ],
[ 29, 41, 28, 32 ],
[ 34, 13, 48, 26 ],
[ 25, 37, 0, 27 ],
[ 30, 4, 23, 32 ],
[ 32, 11, 44, 31 ],
[ 20, 40, 43, 47 ],
[ 5, 14, 39, 11 ],
[ 37, 45, 31, 9 ],
[ 44, 49, 47, 31 ],
[ 47, 33, 40, 22 ],
[ 34, 29, 31, 26 ],
[ 3, 45, 19, 23 ],
[ 34, 40, 7, 22 ],
[ 19, 23, 113, 26 ],
[ 41, 30, 28, 19 ],
[ 26, 44, 113, 30 ],
[ 19, 28, 36, 23 ],
[ 18, 36, 24, 9 ],
[ 35, 22, 39, 30 ],
[ 30, 24, 43, 40 ],
[ 36, 41, 38, 17 ],
[ 45, 31, 39, 47 ],
[ 20, 33, 5, 43 ],
[ 46, 21, 45, 33 ],
[ 40, 38, 28, 113 ],
[ 28, 31, 44, 30 ],
[ 12, 113, 34, 24 ],
[ 44, 21, 38, 18 ],
[ 9, 7, 28, 34 ],
[ 28, 13, 30, 5 ],
[ 25, 22, 27, 43 ],
[ 19, 23, 113, 2 ],
[ 40, 49, 9, 37 ]];

export default function(featuredChecklistItem) {
  if (featuredChecklistItem) {
    return _convertToUint32(PACKS);
  }


  let cards = _unshuffledStandardCards();

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
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    if (new Set(group).size < group.length) {
      return true;
    }
  }

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
