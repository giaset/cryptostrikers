import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  metamaskWatcher: service(),
  web3: service(),

  beforeModel() {
    const web3 = this.get('web3');
    if (this.get('session.isAuthenticated') && web3.get('metamaskDetected') && !web3.get('wrongNetwork')) {
      this.transitionTo('my-album');
    } else {
      return this._super(...arguments);
    }
  },

  // TODO: this needs to update if user changes account
  model() {
    const currentAccount = this.get('metamaskWatcher.currentAccount');
    if (!currentAccount) {
      return null;
    }

    return this.get('store').findRecord('user-metadata', currentAccount).catch(() => {});
  }
});
