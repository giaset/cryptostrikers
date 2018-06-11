const packs = require('./packs.json');
const countForChecklistId = {};
packs.forEach(pack => {
  const checklistIds = _packToChecklistIds(parseInt(pack));
  if (new Set(checklistIds).size !== 4) {
    console.log('DUPLICATES FOUND');
  }
  checklistIds.forEach(checklistId => {
    if (countForChecklistId[checklistId]) {
      countForChecklistId[checklistId]++;
    } else {
      countForChecklistId[checklistId] = 1;
    }
  });
});
console.log(countForChecklistId);

function _packToChecklistIds(pack) {
  const binaryPack = pack.toString(2).padStart(32, '0');
  const checklistId1 = parseInt(binaryPack.substring(0, 8), 2);
  const checklistId2 = parseInt(binaryPack.substring(8, 16), 2);
  const checklistId3 = parseInt(binaryPack.substring(16, 24), 2);
  const checklistId4 = parseInt(binaryPack.substring(24, 32), 2);
  return [checklistId1, checklistId2, checklistId3, checklistId4];
}
