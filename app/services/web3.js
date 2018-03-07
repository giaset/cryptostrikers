import Service from '@ember/service';

export default Service.extend({
  _instance: null,

  init() {
    this._super(...arguments);
    this._instance = new Web3('http://127.0.0.1:8545');
  },

  createAccount() {
    return this._instance.eth.accounts.create();
  },

  encryptAccount(privateKey, password) {
    return this._instance.eth.accounts.encrypt(privateKey, password);
  }
});
