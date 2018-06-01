const packs = require('../packs.json');
const packSaleJson = require('../build/contracts/StrikersPackSale');
const Web3 = require('web3');

const network = 'rinkeby';

let web3;
let contractAddress;
if (network === 'development') {
  web3 = new Web3('http://127.0.0.1:8545');
  contractAddress = '0xa32d4da69c2cc405f98acc58481f9e0dd038f2fa';
} else if (network === 'rinkeby') {
  web3 = new Web3('https://rinkeby.infura.io/b9XMoJFDxpzhBpEGzVaW');
  contractAddress = '0x882df83cc4ae454fbe0ef0e6b4f7e270a21bad90';
}
web3.eth.accounts.wallet.add('0xYOUR_PRIVATE_KEY_HERE');
const StrikersPackSale = new web3.eth.Contract(packSaleJson.abi, contractAddress);

const from = web3.eth.accounts.wallet[0].address;
const gas = 6000000;
const gasPrice = 10000000000; // 10 Gwei
//StrikersPackSale.methods.addPacksToStandardSale(packs).send({ from, gas, gasPrice });
StrikersPackSale.methods.startStandardSale().send({ from, gas, gasPrice });
