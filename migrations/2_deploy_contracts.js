const StrikersChecklist = artifacts.require('./StrikersChecklist.sol');
const StrikersCore = artifacts.require('./StrikersCore.sol');
const StrikersMetadata = artifacts.require('./StrikersMetadata.sol');
const StrikersPackSale = artifacts.require('./StrikersPackSale.sol');
const StrikersUpdate = artifacts.require('./StrikersUpdate.sol');

module.exports = function(deployer, network) {
  const apiUrl = network === 'live' ? 'https://us-central1-cryptostrikers-prod.cloudfunctions.net/cards/' : 'https://us-central1-cryptostrikers-api.cloudfunctions.net/cards/';

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
    let kittiesAddress = strikersCore.address;
    if (network === 'rinkeby') {
      kittiesAddress = '0x16baF0dE678E52367adC69fD067E5eDd1D33e3bF';
    } else if (network === 'live') {
      kittiesAddress = '0x06012c8cf97bead5deae237070f9587f8e7a266d';
    }

    return deployer.deploy(StrikersPackSale, 25000000000000000, kittiesAddress, strikersCore.address);
  })
  .then(packSaleInstance => {
    strikersPackSale = packSaleInstance;
    return strikersCore.setPackSaleAddress(strikersPackSale.address);
  })
  .then(() => strikersPackSale.unpause())
  .then(() => deployer.deploy(StrikersMetadata, apiUrl))
  .then(metadataInstance => strikersCore.setMetadataAddress(metadataInstance.address))
  .then(() => deployer.deploy(StrikersUpdate, strikersCore.address));
};
