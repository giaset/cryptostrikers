const StrikersChecklist = artifacts.require('./StrikersChecklist.sol');
const StrikersCore = artifacts.require('./StrikersCore.sol');
const StrikersPackSale = artifacts.require('./StrikersPackSale.sol');

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
    const batch = packs.slice(startIndex, startIndex + PACKS_PER_LOAD);
    promise = promise.then(() => {
      console.log(`Loading packs ${startIndex}-${startIndex+PACKS_PER_LOAD} (${i+1}/${numberOfTxns})`);
      return strikersPackSale.addBatchToSale(saleId, batch);
    });
  }

  return promise;
}

module.exports = function(deployer, network) {
  // opensea mainnet: 0x1f52b87c3503e537853e160adbf7e330ea0be7c4
  // kitties mainnet:

  let strikersChecklist;
  let strikersCore;
  let strikersPackSale;
  deployer.deploy(StrikersChecklist)
  .then(checklistInstance => {
    strikersChecklist = checklistInstance;
    return strikersChecklist.deployStepOne();
  })
  .then(() => strikersChecklist.deployStepTwo())
  .then(() => strikersChecklist.deployStepThree())
  .then(() => strikersChecklist.deployStepFour())
  .then(() => deployer.deploy(StrikersCore, strikersChecklist.address))
  .then(coreInstance => {
    strikersCore = coreInstance;
    const kittiesAddress = (network === 'rinkeby') ? '0x16baF0dE678E52367adC69fD067E5eDd1D33e3bF' : strikersCore.address;
    return deployer.deploy(StrikersPackSale, 26000000000000000, kittiesAddress, strikersCore.address);
  })
  .then(packSaleInstance => {
    strikersPackSale = packSaleInstance;
    return strikersCore.setPackSaleAddress(strikersPackSale.address);
  });
};
