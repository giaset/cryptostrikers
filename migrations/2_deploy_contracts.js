const StrikersChecklist = artifacts.require('./StrikersChecklist.sol');
const StrikersCore = artifacts.require('./StrikersCore.sol');
const StrikersMetadata = artifacts.require('./StrikersMetadata.sol');
const StrikersPackSale = artifacts.require('./StrikersPackSale.sol');

module.exports = function(deployer, network) {
  // opensea mainnet: 0x1f52b87c3503e537853e160adbf7e330ea0be7c4
  // kitties mainnet:

  const apiUrl = 'https://us-central1-cryptostrikers-api.cloudfunctions.net/cards/';

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
  })
  .then(() => deployer.deploy(StrikersMetadata, apiUrl))
  .then(metadataInstance => strikersCore.setMetadataAddress(metadataInstance.address));
};
