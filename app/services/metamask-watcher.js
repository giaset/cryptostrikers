import Service, { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import ENV from 'cryptostrikers/config/environment';
import RSVP from 'rsvp';

export default Service.extend({
  session: service(),
  web3: service(),

  startWatching: task(function * () {
    if (ENV.environment === 'test') { return; }
    const web3 = this.get('web3');
    const accounts = yield web3.getAccounts();
    const currentAccount = accounts[0];
    const oldAccount = this.get('currentAccount');

    if (oldAccount && (oldAccount != currentAccount)) {
      yield this._forceLogout();
      return;
    }

    this.set('currentAccount', currentAccount);
    if (currentAccount) {
      const userAccount = this.get('session.currentUser.uid');
      if (userAccount && (userAccount != currentAccount)) {
        yield this._forceLogout();
        return;
      }

      const balance = yield web3.getBalance(currentAccount);
      this.set('currentBalance', balance);
    }

    yield timeout(1000);
    this.get('startWatching').perform();
  }),

  _forceLogout() {
    const session = this.get('session');
    if (session.get('isAuthenticated')) {
      return session.close().then(() => {
        window.location.replace('/');
      });
    } else {
      return RSVP.resolve().then(() => {
        window.location.replace('/');
      });
    }
  }
});
