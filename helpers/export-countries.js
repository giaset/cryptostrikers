const contract = require('truffle-contract');
const contractJson = require('../build/contracts/StrikersSale');
const fs = require('fs');
const Web3 = require('web3');

const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');

const WorldCupInfo = contract(contractJson);
WorldCupInfo.setProvider(provider);
WorldCupInfo.at('0x9414329bf6837db915b4d5e0e22ecc27a33129c5')
.then(instance => {
  const promises = [];
  for (let i = 0; i < 32; i++) {
    promises.push(instance.countries(i));
  }
  return Promise.all(promises);
})
.then(results => {
  const final = results.map((result, index) => {
    return {
      id: index,
      name: result
    };
  });
  return fs.writeFileSync('public/countries.json', JSON.stringify({countries: final}, null, 2));
});
