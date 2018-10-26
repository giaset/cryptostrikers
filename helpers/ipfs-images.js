const fs = require('fs');
const ipfsAPI = require('ipfs-api');

const ipfs = ipfsAPI({
  host: 'ipfs.infura.io',
  port: '5001',
  protocol: 'https'
});

let serialPromise = Promise.resolve('STARTING NOW!');
const path = './public/assets/images/cards/';
fs.readdirSync(path).forEach(filename => {
  if (filename === '.DS_Store') { return; }
  serialPromise = serialPromise.then(result => {
    console.log(filename);
    console.log(result);
    return ipfs.add(fs.readFileSync(path + filename));
  });
});
serialPromise.then(result => console.log(result));
