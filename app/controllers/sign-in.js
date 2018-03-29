import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  ajax: service(),
  metamaskWatcher: service(),
  session: service(),
  web3: service(),
  actions: {
    submit() {
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
        .then(() => {
          this.transitionToRoute('my-album');
        });
    }
  }
});
