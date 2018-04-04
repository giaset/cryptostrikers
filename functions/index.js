const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const functions = require('firebase-functions');
const serviceAccount = require(functions.config().strikers.service_account);
const sigUtil = require('eth-sig-util');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: functions.config().strikers.database_url
});

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
