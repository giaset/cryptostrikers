import Base from 'ember-simple-auth/authenticators/base';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Base.extend({
  web3: service(),

  restore(data) {
    return new RSVP.Promise((resolve, reject) => {
      if (data.encrypted) {
        resolve({encrypted: data.encrypted});
      } else {
        reject();
      }
    });
  },

  authenticate(opts) {
    const web3 = this.get('web3');
    if (opts.seedPhrase) {
      return web3.accountFromSeedPhrase(opts.seedPhrase).then(account => {
        return {encrypted: web3.encryptAccount(account.privateKey)};
      });
    }
  }
});
