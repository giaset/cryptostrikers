const admin = require('firebase-admin');
const app = require('express')();
const contractJson = require('./StrikersMinting');
const cors = require('cors')({origin: true});
const functions = require('firebase-functions');
const serviceAccount = require(functions.config().strikers.service_account);
const sigUtil = require('eth-sig-util');
const Web3 = require('web3');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: functions.config().strikers.database_url
});

// TODO: use config for mainnet infura and contract address
// mainnet: https://mainnet.infura.io/b9XMoJFDxpzhBpEGzVaW
const web3 = new Web3('https://rinkeby.infura.io/b9XMoJFDxpzhBpEGzVaW');
const address = '0xAfA2D5AdB646DD90424f522BA8EE8cc118534c48';
const strikersContract = new web3.eth.Contract(contractJson.abi, address);

app.use(cors);
app.get('/:id', (req, res) => {
  const cardId = req.params.id;
  strikersContract.methods.cards(cardId).call().then(card => {
    return res.json(card);
  })
  .catch(error => {
    res.status(404).send('Card not found');
  });
});
exports.cards = functions.https.onRequest(app);

exports.sign = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    const address = req.body.address;
    const signature = req.body.signature;
    if (address && signature) {
      const msgParams = {data: 'CryptoStrikers', sig: signature};
      const recovered = sigUtil.recoverPersonalSignature(msgParams);
      if (recovered === sigUtil.normalize(address)) {
        admin.auth().createCustomToken(address)
          .then(customToken => res.json({token: customToken}))
          .catch(error => res.json({error: error}));
      } else {
        res.status(401).send('Wrong signature for address.');
      }
    } else {
      res.status(500).send('Invalid address and signature params.');
    }
  });
});
