const StrikersMinting = artifacts.require("./StrikersMinting.sol");
const PackSale = artifacts.require("./PackSale.sol");

const TOTAL_PACKS = 20000;
const PACKS_PER_LOAD = 500;

module.exports = function(deployer) {
  const packs = [];
  for (let i = 0; i < TOTAL_PACKS; i++) {
    let pack = '';
    for (let j = 0; j < 4; j++) {
      const playerId = Math.floor(Math.random() * 25);
      const binaryPlayerId = playerId.toString(2);
      const paddedBinaryPlayerId = '00000000'.substr(binaryPlayerId.length) + binaryPlayerId;
      pack += paddedBinaryPlayerId;
    }
    packs.push(parseInt(pack, 2));
  }

  let strikersMinting;
  let packSale;
  let promise = deployer.deploy(StrikersMinting)
    .then(() => StrikersMinting.deployed())
    .then(deployed => {
      strikersMinting = deployed;
      return deployer.deploy(PackSale, strikersMinting.address);
    })
    .then(() => PackSale.deployed())
    .then(deployed => {
      packSale = deployed;
      return strikersMinting.setPackSaleAddress(packSale.address);
    })
    .then(() => packSale.startNewRun());

    const numberOfLoops = TOTAL_PACKS / PACKS_PER_LOAD;
    for (let i = 0; i < numberOfLoops; i++) {
      const startIndex = i * PACKS_PER_LOAD;
      const subArray = packs.slice(startIndex, startIndex + PACKS_PER_LOAD);
      promise = promise.then(() => {
        console.log(`Loading packs ${startIndex}-${startIndex+PACKS_PER_LOAD} (${i+1}/${numberOfLoops})`);
        return packSale.loadShuffledPacks(subArray);
      });
    }

    promise
    .then(() => packSale.finishRun())
    .then(() => packSale.startSale());
};
