const contractJson = require('../build/contracts/StrikersChecklist');
const fs = require('fs');
const Web3 = require('web3');

const web3 = new Web3('http://127.0.0.1:8545');
const contractAddress = '0x9414329bf6837db915b4d5e0e22ecc27a33129c5';
const Checklist = new web3.eth.Contract(contractJson.abi, contractAddress);
exportChecklist();
exportPlayers();

function exportChecklist() {
  const contract = Checklist.methods;
  const countPromises = [
    contract.originalsCount().call(),
    contract.iconicsCount().call()
  ];

  let originalsCount;
  let iconicsCount;
  Promise.all(countPromises)
  .then(counts => {
    originalsCount = parseInt(counts[0]);
    iconicsCount = parseInt(counts[1]);
    const promises = [];
    for (let i = 0; i < originalsCount; i++) {
      promises.push(contract.originalChecklistItems(i).call());
    }
    for (let i = 0; i < iconicsCount; i++) {
      promises.push(contract.iconicChecklistItems(i).call());
    }
    return Promise.all(promises);
  })
  .then(checklistItems => {
    const result = {};
    checklistItems.forEach((checklistItem, index) => {
      const isIconic = index >= originalsCount;
      const setId = isIconic ? '1' : '0';
      const id = isIconic ? (index - originalsCount) : index;
      const paddedId = ('0' + id).slice(-2);
      const checklistId = setId + paddedId;
      result[checklistId] = {
        checklistSet: setId,
        player: checklistItem.playerId,
        tier: checklistItem.tier
      };
    });
    fs.writeFileSync('checklist.json', JSON.stringify(result, null, 2));
  });
}

function exportPlayers() {
  Checklist.getPastEvents('PlayerAdded', { fromBlock: 0, toBlock: 'latest' })
  .then(events => {
    const players = events.map(event => ({ name: event.returnValues.name, country: '0' }));
    fs.writeFileSync('players.json', JSON.stringify(players, null, 2));
  });
}
