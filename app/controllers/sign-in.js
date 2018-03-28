import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  metamaskWatcher: service(),
  web3: service(),
  actions: {
    submit() {
      const currentAccount = this.get('metamaskWatcher.currentAccount');
      this.get('web3').personalSign('CryptoStrikers', currentAccount);
    }
  }
});
