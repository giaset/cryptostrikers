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
const address = '0xcfd0ebf5100fdc1b3d2f460f65681d9287da467c';
const strikersContract = new web3.eth.Contract(contractJson.abi, address);

app.use(cors);
app.get('/:id', (req, res) => {
  const cardId = req.params.id;
  let card;
  let playerId;
  let player;
  strikersContract.methods.cards(cardId).call().then(_card => {
    card = _card;
    playerId = card.playerId;
    return admin.database().ref(`/players/${playerId}`).once('value');
  })
  .then(snapshot => {
    player = snapshot.val();
    return admin.database().ref(`/countries/${player.country}`).once('value');
  })
  .then(snapshot => {
    const country = snapshot.val();
    const serialNumber = parseInt(card.serialNumber);
    const setId = parseInt(card.setId);
    const setName = (setId === 1) ? 'Base Set' : 'Daily Challenge Set';
    const payload = {
      imageUrl: `https://staging.cryptostrikers.com/assets/cards/s${setId}/${playerId}.svg`,
      externalUrl: 'https://www.cryptostrikers.com/',
      description: `${setName} - #${serialNumber}/TODO`,
      name: player.name,
      properties: {
        country: country.name,
        group: `Group ${country.group}`,
        player: player.name,
        setName
      }
    };
    payload.properties['Serial Number'] = serialNumber;
    return res.json(payload);
  })
  .catch(error => res.status(500).json({error: error.toString()}));
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
          .catch(error => res.status(500).json({error: error.toString()}));
      } else {
        res.status(401).send('Wrong signature for address.');
      }
    } else {
      res.status(500).send('Invalid address and signature params.');
    }
  });
});

exports.updateUserCount = functions.database.ref('users/{userId}').onCreate(() => {
  return admin.database().ref('stats/stats/userCount').transaction(userCount => (userCount || 0) + 1);
});
