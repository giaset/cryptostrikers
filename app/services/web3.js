import RSVP from 'rsvp';
import Service from '@ember/service';
import ENV from 'cryptostrikers/config/environment';

export default Service.extend({
  _instance: null,

  setup() {
    if (document.readyState === 'complete') {
      const success = this._setup();
      return success ? RSVP.resolve() : RSVP.reject();
    } else {
      return new RSVP.Promise((resolve, reject) => {
        window.addEventListener('load', () => {
          const success = this._setup();
          if (success) {
            resolve();
          } else {
            reject();
          }
        });
      });
    }
  },

  _setup() {
    if (typeof web3 === 'undefined') {
      this.set('metamaskDetected', false);
      return false;
    }

    this._instance = new Web3(web3.currentProvider);
    this.set('metamaskDetected', true);
    return true;
  },

  checkNetwork() {
    const correctNetworkId = ENV.strikers.networkId;
    return this._instance.eth.net.getId().then(id => {
      if (id !== correctNetworkId) {
        this.set('wrongNetwork', true);
        throw new Error('Wrong Network!');
      }
    });
  },

  _accounts() {
    return this._instance.eth.accounts;
  },

  currentProvider() {
    return this._instance.currentProvider;
  },

  getBalance(address) {
    return this._instance.eth.getBalance(address);
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
  },

  weiToEther(wei) {
    return this._instance.utils.fromWei(wei);
  },

  contract(abi, address) {
    return new this._instance.eth.Contract(abi, address);
  },

  decodeLog(inputs, data, topics) {
    return this._instance.eth.abi.decodeLog(inputs, data, topics);
  },

  getAccounts() {
    return this._instance.eth.getAccounts();
  },

  getTransactionReceipt(hash) {
    return this._instance.eth.getTransactionReceipt(hash);
  },

  personalSign(dataToSign, from) {
    return this._instance.eth.personal.sign(dataToSign, from);
  }
});
