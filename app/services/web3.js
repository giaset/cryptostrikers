import RSVP from 'rsvp';
import Service from '@ember/service';

export default Service.extend({
  _instance: null,
  currentAccount: null,

  init() {
    this._super(...arguments);
    this._instance = new Web3('http://127.0.0.1:8545');
  },

  _accounts() {
    return this._instance.eth.accounts;
  },

  setCurrentAccount(account) {
    this.set('currentAccount', account);
  },

  encryptAccount(privateKey, password = '') {
    return new RSVP.Promise(resolve => {
      resolve(this._accounts().encrypt(privateKey, password));
    });
  },

  decryptAccount(account, password = '') {
    return new RSVP.Promise(resolve => {
      resolve(this._accounts().decrypt(account, password));
    });
  },

  _wallet() {
    return this._accounts().wallet;
  },

  addAccountToWallet(account) {
    this._wallet().add(account);
  },

  generateSeedPhrase() {
    return lightwallet.keystore.generateRandomSeed();
  },

  accountFromSeedPhrase(seedPhrase) {
    const password = '';
    return new RSVP.Promise((resolve, reject) => {
      lightwallet.keystore.createVault({
        hdPathString: 'm/44\'/60\'/0\'/0',
        password: password,
        seedPhrase: seedPhrase
      }, (err, ks) => {
        if (err) {
          reject(err);
          return;
        }

        ks.keyFromPassword(password, (err, pwDerivedKey) => {
          if (err) {
            reject(err);
            return;
          }

          ks.generateNewAddress(pwDerivedKey);
          const address = ks.getAddresses()[0];
          const privKey = ks.exportPrivateKey(address, pwDerivedKey);
          const account = this._accounts().privateKeyToAccount('0x'+privKey);
          resolve(account);
        });
      });
    });
  }
});
