const StrikersPackFactory = artifacts.require("./StrikersPackFactory.sol");

module.exports = function(deployer) {
  const packs = [];
  for (let i = 0; i < 30; i++) {
    const pack = [];
    for (let j = 0; j < 4; j++) {
      const playerId = Math.floor((Math.random() * 24) + 1);
      pack.push(playerId);
    }
    packs.push(pack);
  }

  deployer.deploy(StrikersPackFactory)
  .then(() => StrikersPackFactory.deployed())
  .then(packFactory => {
    packFactory.mintRun(packs);
  });
};
