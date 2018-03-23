const StrikersSale = artifacts.require("./StrikersSale.sol");
const WorldCupInfo = artifacts.require('./WorldCupInfo.sol');

module.exports = function(deployer) {
  deployer.deploy(StrikersSale, 475, 10);
  deployer.deploy(WorldCupInfo);
};
