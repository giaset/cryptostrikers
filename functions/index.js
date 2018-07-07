const admin = require('firebase-admin');
const app = require('express')();
const contractJson = require('./StrikersCore');
const cors = require('cors')({ origin: true });
const functions = require('firebase-functions');
const request = require('request');
const strikersConfig = functions.config().strikers;
const serviceAccount = require(strikersConfig.service_account);
const sigUtil = require('eth-sig-util');
const Web3 = require('web3');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: strikersConfig.database_url
});

const web3 = new Web3(strikersConfig.infura_url);
const strikersContract = new web3.eth.Contract(contractJson.abi, strikersConfig.contract_address);

function _newAttribute(name, value, max, type) {
  const attribute = { trait_type: name, value };

  if (max) {
    attribute.max_value = max;
  }

  if (type) {
    attribute.display_type = type;
  }

  return attribute;
}

app.use(cors);
app.get('/:id', (req, res) => {
  const cardId = req.params.id;
  const result = { attributes: [] };
  let serialNumber;
  let starCounts = {};
  admin.database().ref('/starCounts/starCounts/starCounts').once('value')
  .then(snapshot => {
    starCounts = snapshot.val();
    return strikersContract.methods.cards(cardId).call();
  })
  .then(contractCard => {
    // Firebase doesn't support padStart...
    const checklistId = ('000'+contractCard.checklistId).substring(contractCard.checklistId.length);
    result.attributes.push(_newAttribute('checklist_ID', `#${checklistId}`));
    const extension = contractCard.checklistId >= 100 ? 'png' : 'svg';

    let starCountString = '';
    const starCount = starCounts[cardId];
    if (starCount > 0) {
      for (let i = 0; i < starCount; i++) {
        starCountString += '*';
      }
    }

    result.image = `https://www.cryptostrikers.com/assets/images/cards/${checklistId}${starCountString}.${extension}`;
    result.external_url = `https://www.cryptostrikers.com/checklist/${checklistId}?card_id=${cardId}`;
    serialNumber = parseInt(contractCard.serialNumber);
    return admin.database().ref(`/checklistItems/${checklistId}`).once('value');
  })
  .then(snapshot => {
    const checklistItem = snapshot.val();
    const playerId = checklistItem.player;
    const setId = checklistItem.checklistSet;
    const tierId = checklistItem.tier;
    const playerPromise = admin.database().ref(`/players/${playerId}`).once('value');
    const setPromise = admin.database().ref(`/checklistSets/${setId}`).once('value');
    const tierPromise = admin.database().ref(`/rarityTiers/${tierId}`).once('value');
    return Promise.all([playerPromise, setPromise, tierPromise]);
  })
  .then(snapshots => {
    const player = snapshots[0].val();
    result.attributes.push(_newAttribute('player', player.name));
    result.name = player.name;

    const set = snapshots[1].val();
    result.attributes.push(_newAttribute('set', set.name));

    const tier = snapshots[2].val();
    const limit = tier.limit;
    result.attributes.push(_newAttribute('serial_number', serialNumber, limit, 'number'));
    result.attributes.push(_newAttribute('tier', tier.name));
    result.description = `${set.name} - #${serialNumber}/${tier.limit}`;


    return admin.database().ref(`/countries/${player.country}`).once('value');
  })
  .then(snapshot => {
    const country = snapshot.val();
    result.attributes.push(_newAttribute('country', country.name));
    return res.json(result);
  })
  .catch(error => res.status(500).json({ error: error.toString() }));
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
          .then(token => res.json({ token }))
          .catch(error => res.status(500).json({ error: error.toString() }));
      } else {
        res.status(401).send('Wrong signature for address.');
      }
    } else {
      res.status(500).send('Invalid address and signature params.');
    }
  });
});

exports.subscribe = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Wrong request type!');
    }

    const emailAddress = req.body.email_address;
    if (!emailAddress) {
      return res.status(422).send('Missing email_address in body!');
    }

    const baseUrl = 'https://api.constantcontact.com/v2/contacts';
    const apiKey = 'esm9wkaye32fxy8ugej2nhm8';
    const accessToken = '30f9c08c-ddfc-4d02-8f35-eef9404debd7';
    const url = `${baseUrl}?api_key=${apiKey}&access_token=${accessToken}`;
    const json = {
      email_addresses: [{ email_address: emailAddress }],
      lists: [{ id: '1228981848' }]
    };
    const method = 'POST';
    const options = { url, json, method };
    return request(options, (_, response, body) => {
      res.status(response.statusCode).json(body);
    });
  });
});

exports.updateUserCount = functions.database.ref('users/{userId}').onCreate(() => {
  return admin.database().ref('stats/stats/userCount').transaction(userCount => (userCount || 0) + 1);
});
