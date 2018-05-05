import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  metamaskWatcher: service(),
  web3: service(),

  beforeModel() {
    if (this.get('session.isAuthenticated') && !this.get('web3.wrongNetwork')) {
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
