import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  ajax: service(),
  currentUser: service(),
  metamaskWatcher: service(),
  session: service(),
  web3: service(),
  actions: {
    submit() {
      // TODO: loading state for submit button
      const currentAccount = this.get('metamaskWatcher.currentAccount');
      this.get('web3').personalSign('CryptoStrikers', currentAccount)
      .then(signature => {
        return this.get('ajax').post('sign', {
          data: {
            address: currentAccount,
            signature: signature
          }
        });
      })
      .then(res => {
        const options = {
          provider: 'custom',
          token: res.token
        };
        return this.get('session').open('firebase', options);
      })
      .then(sessionData => {
        return this._createUser(sessionData, this.get('emailAddress'), this.get('nickname'));
      })
      .then(() => {
        this.transitionToRoute('my-album');
      });
    }
  },

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
