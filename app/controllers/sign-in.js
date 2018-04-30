import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  ajax: service(),
  currentUser: service(),
  metamaskWatcher: service(),
  session: service(),
  web3: service(),

  signIn: task(function * () {
    const address = this.get('metamaskWatcher.currentAccount');
    const signature = yield this.get('getSignature').perform(address);
    const token = yield this.get('verifySignature').perform(address, signature);
    yield this.get('openSession').perform(token);
    this.transitionToRoute('my-album');
  }).drop(),


  getSignature: task(function * (address) {
    return yield this.get('web3').personalSign('CryptoStrikers', address);
  }),

  verifySignature: task(function * (address, signature) {
    const data = { address, signature };
    const response = yield this.get('ajax').post('sign', { data });
    return response.token;
  }),

  openSession: task(function * (token) {
    const options = { provider: 'custom', token };
    const sessionData = yield this.get('session').open('firebase', options);
    const email = this.get('emailAddress');
    const nickname = this.get('nickname');

    if (email && nickname) {
      yield this._createUser(sessionData, email, nickname);
    }
  }),

  _createUser(sessionData, email, nickname) {
    const id = sessionData.uid;
    const store = this.get('store');

    const metadata = store.createRecord('user-metadata', {
      id,
      nickname
    });

    const user = store.createRecord('user', {
      id,
      email,
      metadata
    });

    this.get('currentUser').setUser(user);

    return metadata.save().then(() => user.save());
  }
});
