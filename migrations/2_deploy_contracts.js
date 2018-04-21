const StrikersMinting = artifacts.require("./StrikersMinting.sol");
const StrikersPackSale = artifacts.require("./StrikersPackSale.sol");

const CARDS_PER_PACK = 4;
const PACKS_PER_LOAD = 1;
const TOTAL_PACKS = 10;
const TOTAL_PLAYERS = 25;

module.exports = function(deployer) {
  const packs = [];
  for (let i = 0; i < TOTAL_PACKS; i++) {
    let pack = '';
    for (let j = 0; j < CARDS_PER_PACK; j++) {
      const playerId = Math.floor(Math.random() * TOTAL_PLAYERS);
      const binaryPlayerId = playerId.toString(2);
      const paddedBinaryPlayerId = '00000000'.substr(binaryPlayerId.length) + binaryPlayerId;
      pack += paddedBinaryPlayerId;
    }
    packs.push(parseInt(pack, 2));
  }

  let strikersMinting;
  let strikersPackSale;
  let promise = deployer.deploy(StrikersMinting)
    .then(() => StrikersMinting.deployed())
    .then(deployed => {
      strikersMinting = deployed;
      return deployer.deploy(StrikersPackSale, strikersMinting.address);
    })
    .then(() => StrikersPackSale.deployed())
    .then(deployed => {
      strikersPackSale = deployed;
      return strikersMinting.setPackSaleAddress(strikersPackSale.address);
    })
    .then(() => strikersPackSale.createSale(0));

    const numberOfLoops = TOTAL_PACKS / PACKS_PER_LOAD;
    for (let i = 0; i < numberOfLoops; i++) {
      const startIndex = i * PACKS_PER_LOAD;
      const subArray = packs.slice(startIndex, startIndex + PACKS_PER_LOAD);
      promise = promise.then(() => {
        console.log(`Loading packs ${startIndex}-${startIndex+PACKS_PER_LOAD} (${i+1}/${numberOfLoops})`);
        return strikersPackSale.loadShuffledPacks(0, subArray);
      });
    }

    promise
    .then(() => strikersPackSale.startSale(0));
};
