const Checklist = artifacts.require('./Checklist.sol');
const SaleClockAuction = artifacts.require('./OpenSea/SaleClockAuction.sol');
const StrikersCore = artifacts.require('./StrikersCore.sol');
const StrikersPackSale = artifacts.require('./StrikersPackSale.sol');
const StrikersTrading = artifacts.require('./StrikersTrading.sol');

const CARDS_PER_PACK = 4;
const PACKS_PER_LOAD = 500;
const BASE_SALE_PACK_COUNT = 1000;//20000;
const FLASH_SALE_PACK_COUNT = 1000;
const BASE_SET_COUNT = 25;

function generatePacks(numberOfPacks) {
  const packs = [];

  for (let i = 0; i < numberOfPacks; i++) {
    let pack = '';
    for (let j = 0; j < CARDS_PER_PACK; j++) {
      const checklistId = Math.floor(Math.random() * BASE_SET_COUNT);
      const binaryChecklistId = checklistId.toString(2);
      const paddedBinaryChecklistId = '00000000'.substr(binaryChecklistId.length) + binaryChecklistId;
      pack += paddedBinaryChecklistId;
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
  // opensea mainnet: 0x1f52b87c3503e537853e160adbf7e330ea0be7c4
  // kitties mainnet:

  let strikersCore;
  let strikersPackSale;
  let promise = deployer.deploy(Checklist)
  .then(() => Checklist.deployed())
  .then(checklist => deployer.deploy(StrikersCore, checklist.address))
  .then(() => StrikersCore.deployed())
  .then(deployed => {
    strikersCore = deployed;
    const kittiesAddress = (network === 'rinkeby') ? '0x16baF0dE678E52367adC69fD067E5eDd1D33e3bF' : strikersCore.address;
    return deployer.deploy(StrikersPackSale, kittiesAddress, strikersCore.address);
  });

  let saleAuctionAddress;
  if (network === 'development') {
    promise = promise.then(() => {
      console.log('Deploying SaleClockAuction...');
      return deployer.deploy(SaleClockAuction, 125);
    })
    .then(() => SaleClockAuction.deployed())
    .then(deployed => {
      saleAuctionAddress = deployed.address;
    });
  } else if (network === 'rinkeby') {
    saleAuctionAddress = '0xed6cfc67429e8eb9b4562ea6d7d54ffcc4b726bd';
  }

  promise.then(() => strikersCore.setSaleAuctionAddress(saleAuctionAddress))
  .then(() => StrikersPackSale.deployed())
  .then(deployed => {
    strikersPackSale = deployed;
    return strikersCore.setPackSaleAddress(strikersPackSale.address);
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
  .then(() => strikersPackSale.startSale(2))
  .then(() => deployer.deploy(StrikersTrading));
};
