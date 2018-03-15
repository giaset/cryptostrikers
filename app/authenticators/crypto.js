import Base from 'ember-simple-auth/authenticators/base';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Base.extend({
  currentUser: service(),
  session: service(),
  web3: service(),

  authenticate(opts) {
    const web3 = this.get('web3');
    const hasPassword = opts.password != undefined;
    if (opts.seedPhrase && hasPassword) {
      return web3.accountFromSeedPhrase(opts.seedPhrase)
      .then(account => web3.encryptAccount(account.privateKey, opts.password))
      .then(encryptedAccount => {
        this.get('session').set('data.encryptedAccount', encryptedAccount);
        return RSVP.resolve();
      });
    } else if (hasPassword) {
      const encryptedAccount = this.get('session.data.encryptedAccount');
      return web3.decryptAccount(encryptedAccount, opts.password)
      .then(account => {
        this._setCurrentUser(account);
        return RSVP.resolve();
      });
    }
  },

  invalidate() {
    this._setCurrentUser(null);
    this.get('session').set('data.encryptedAccount', null);
    return RSVP.resolve();
  },

  _setCurrentUser(account) {
    this.get('currentUser').setUser(account);
  }
});
