const StrikersSale = artifacts.require("./StrikersSale.sol");

module.exports = function(deployer) {
  const packs = [];
  for (let i = 0; i < 60; i++) {
    let pack = '';
    for (let j = 0; j < 4; j++) {
      const playerId = Math.floor((Math.random() * 24) + 1);
      const binaryPlayerId = playerId.toString(2);
      const paddedBinaryPlayerId = '00000000'.substr(binaryPlayerId.length) + binaryPlayerId;
      pack += paddedBinaryPlayerId;
    }
    packs.push(parseInt(pack, 2));
  }

  let contract;
  deployer.deploy(StrikersSale)
   .then(() => StrikersSale.deployed())
   .then(deployed => {
     contract = deployed;
     return contract.startNewRun();
   })
   .then(() => contract.loadShuffledPacks(packs))
   .then(() => contract.finishRun())
   .then(() => contract.startSale());
};
