const contractJson = require('../build/contracts/Checklist');
const fs = require('fs');
const Web3 = require('web3');

const web3 = new Web3('http://127.0.0.1:8545');
const contractAddress = '0x9414329bf6837db915b4d5e0e22ecc27a33129c5';
const Checklist = new web3.eth.Contract(contractJson.abi, contractAddress).methods;
exportChecklist();
exportPlayers();

function exportChecklist() {
  const BASE_SET_COUNT = 25;
  const GILANG_SET_COUNT = 20;
  const promises = [];
  for (let i = 0; i < BASE_SET_COUNT; i++) {
    promises.push(Checklist.setIdToChecklistItems(0, i).call());
  }
  for (let i = 0; i < GILANG_SET_COUNT; i++) {
    promises.push(Checklist.setIdToChecklistItems(1, i).call());
  }
  return Promise.all(promises).then(checklistItems => {
    const result = {};
    checklistItems.forEach((checklistItem, index) => {
      const isGilang = index > (BASE_SET_COUNT - 1);
      const setId = isGilang ? '1' : '0';
      const id = isGilang ? (index - BASE_SET_COUNT) : index;
      const paddedId = ('0' + id).slice(-2);
      const checklistId = setId + paddedId;
      result[checklistId] = {
        player: checklistItem.playerId,
        set: setId,
        totalIssuance: checklistItem.totalIssuance
      };
    });
    fs.writeFileSync('checklist.json', JSON.stringify(result, null, 2));
  });
}

function exportPlayers() {
  const PLAYER_COUNT = 50;
  const promises = [];
  for (let i = 0; i < PLAYER_COUNT; i++) {
    promises.push(Checklist.players(i).call());
  }
  return Promise.all(promises).then(players => {
    const result = players.map(player => {
      return {
        country: player.countryId,
        name: player.fullName
      };
    });
    fs.writeFileSync('players.json', JSON.stringify(result, null, 2));
  });
}
