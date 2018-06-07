import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  ajax: service(),
  confirmedEmail: false,
  currentUser: service(),
  metamaskWatcher: service(),
  queryParams: ['referral_code'],
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
    const confirmedEmail = this.get('confirmedEmail');
    const email = this.get('emailAddress');
    const nickname = this.get('nickname');
    const referrer = this.get('model.referrer');

    if (email && nickname) {
      yield this._createUser(sessionData, confirmedEmail, email, nickname, referrer);
    } else {
      yield this.get('currentUser').load();
    }
  }),

  _createUser(sessionData, confirmedEmail, email, nickname, referrer) {
    const id = sessionData.uid;
    const store = this.get('store');

    const metadata = store.createRecord('user-metadata', {
      id,
      nickname
    });

    const user = store.createRecord('user', {
      id,
      confirmedEmail,
      email,
      metadata,
      referrer
    });

    localStorage.removeItem('referralCode');
    this.get('currentUser').setUser(user);

    return metadata.save().then(() => user.save());
  }
});
