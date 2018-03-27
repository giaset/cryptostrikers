import RSVP from 'rsvp';
import Service from '@ember/service';
import $ from 'jquery';
import { computed } from '@ember/object';

export default Service.extend({
  _instance: null,

  setup() {
    if (typeof web3 !== 'undefined') {
      this._instance = new Web3(web3.currentProvider);
      this.set('metaMaskDetected', true);
    } else {
      this.set('metaMaskDetected', false);
    }
  },

  waitingForSetup: computed.none('metaMaskDetected'),

  _accounts() {
    return this._instance.eth.accounts;
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

  _contract(abi, address) {
    return new this._instance.eth.Contract(abi, address);
  },

  loadAllContracts() {
    const saleContractPromise = $.getJSON('contracts/StrikersSale.json')
    .then(json => {
      this.saleContract = this._contract(json.abi, '0x9414329bf6837db915b4d5e0e22ecc27a33129c5');
    });

    return saleContractPromise;
  }
});
