const StrikersMinting = artifacts.require("./StrikersMinting.sol");
const StrikersPackSale = artifacts.require("./StrikersPackSale.sol");

const CARDS_PER_PACK = 4;
const PACKS_PER_LOAD = 500;
const BASE_SALE_PACK_COUNT = 20000;
const FLASH_SALE_PACK_COUNT = 1000;
const TOTAL_PLAYERS = 25;

function generatePacks(numberOfPacks) {
  const packs = [];

  for (let i = 0; i < numberOfPacks; i++) {
    let pack = '';
    for (let j = 0; j < CARDS_PER_PACK; j++) {
      const playerId = Math.floor(Math.random() * TOTAL_PLAYERS);
      const binaryPlayerId = playerId.toString(2);
      const paddedBinaryPlayerId = '00000000'.substr(binaryPlayerId.length) + binaryPlayerId;
      pack += paddedBinaryPlayerId;
    }
    packs.push(parseInt(pack, 2));
  }

  return packs;
}

function loadPacks(saleId, packs, strikersPackSale) {
  const numberOfTxns = packs.length / PACKS_PER_LOAD;
  let promise = Promise.resolve();

  for (let i = 0; i < numberOfTxns; i++) {
    const startIndex = i * PACKS_PER_LOAD;
    const subArray = packs.slice(startIndex, startIndex + PACKS_PER_LOAD);
    promise = promise.then(() => {
      console.log(`Loading packs ${startIndex}-${startIndex+PACKS_PER_LOAD} (${i+1}/${numberOfTxns})`);
      return strikersPackSale.loadShuffledPacks(saleId, subArray);
    });
  }

  return promise;
}

module.exports = function(deployer, network) {
  let strikersMinting;
  let strikersPackSale;
  deployer.deploy(StrikersMinting)
    .then(() => StrikersMinting.deployed())
    .then(deployed => {
      strikersMinting = deployed;
      const kittiesAddress = (network === 'rinkeby') ? '0x16baF0dE678E52367adC69fD067E5eDd1D33e3bF' : strikersMinting.address;
      return deployer.deploy(StrikersPackSale, kittiesAddress, strikersMinting.address);
    })
    .then(() => StrikersPackSale.deployed())
    .then(deployed => {
      strikersPackSale = deployed;
      return strikersMinting.setPackSaleAddress(strikersPackSale.address);
    })
    .then(() => strikersPackSale.createSale(0, 15000000000000000))
    .then(() => {
      const baseSalePacks = generatePacks(BASE_SALE_PACK_COUNT);
      return loadPacks(0, baseSalePacks, strikersPackSale);
    })
    .then(() => strikersPackSale.startSale(0))
    .then(() => strikersPackSale.createSale(86400, 30000000000000000))
    .then(() => {
      const flashSalePacks = generatePacks(FLASH_SALE_PACK_COUNT);
      return loadPacks(1, flashSalePacks, strikersPackSale);
    })
    .then(() => strikersPackSale.startSale(1))
    .then(() => strikersPackSale.createSale(0, 0))
    .then(() => {
      const kittySalePacks = generatePacks(5);
      return loadPacks(2, kittySalePacks, strikersPackSale);
    })
    .then(() => strikersPackSale.startSale(2));
};
