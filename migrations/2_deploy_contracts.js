const StrikersBase = artifacts.require("./StrikersBase.sol");
const PackSale = artifacts.require("./PackSale.sol");

module.exports = function(deployer) {
  const packs = [];
  for (let i = 0; i < 500; i++) {
    let pack = '';
    for (let j = 0; j < 4; j++) {
      const playerId = Math.floor((Math.random() * 24) + 1);
      const binaryPlayerId = playerId.toString(2);
      const paddedBinaryPlayerId = '00000000'.substr(binaryPlayerId.length) + binaryPlayerId;
      pack += paddedBinaryPlayerId;
    }
    packs.push(parseInt(pack, 2));
  }

  let strikersBase;
  let packSale;
  deployer.deploy(StrikersBase)
    .then(() => StrikersBase.deployed())
    .then(deployed => {
      strikersBase = deployed;
      return deployer.deploy(PackSale, strikersBase.address);
    })
    .then(() => PackSale.deployed())
    .then(deployed => {
      packSale = deployed;
      return strikersBase.setPackSaleAddress(packSale.address);
    })
    .then(() => packSale.startNewRun())
    .then(() => packSale.loadShuffledPacks(packs))
    .then(() => packSale.finishRun())
    .then(() => packSale.startSale());
};
