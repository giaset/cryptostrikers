const fs = require('fs');
const shuffle = require('shuffle-array');

const ORIGINALS_COUNT = 100;
const PACK_SIZE = 4;

const checklistIds = [];
for (let i = 0; i < ORIGINALS_COUNT; i++) {
  const count = countForChecklistId(i);
  for (let j = 0; j < count; j++) {
    checklistIds.push(i);
  }
}

while (true) {
  shuffle(checklistIds);
  const groupedChecklistIds = groupIntoFours(checklistIds);
  const duplicatesFound = checkForDuplicates(groupedChecklistIds);
  if (!duplicatesFound) {
    const packs = convertToUint32(groupedChecklistIds);
    fs.writeFileSync('packs.json', JSON.stringify(packs));
    break;
  }
}

function checkForDuplicates(groups) {
  groups.forEach(group => {
    if (new Set(group).size < group.length) {
      return true;
    }
  });
  return false;
}

function convertToUint32(groupedChecklistIds) {
  return groupedChecklistIds.map(group => {
    let pack = '';
    group.forEach(checklistId => {
      const binary = checklistId.toString(2);
      const paddedBinary = '00000000'.substr(binary.length) + binary;
      pack += paddedBinary;
    });
    return parseInt(pack, 2);
  });
}

function countForChecklistId(id) {
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

function groupIntoFours(array) {
  const groups = [];
  for (let i = 0; i < array.length; i+=4) {
    const group = [array[i], array[i+1], array[i+2], array[i+3]];
    groups.push(group);
  }
  return groups;
}
