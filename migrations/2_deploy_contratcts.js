var PackSale = artifacts.require("./PackSale.sol");

module.exports = function(deployer) {
  deployer.deploy(PackSale, 475, 10);
};
