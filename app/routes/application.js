import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentUser: service(),
  metamaskWatcher: service(),
  strikersContracts: service(),
  web3: service(),
  actions: {
    accessDenied() {
      this.transitionTo('sign-in');
    }
  },

  beforeModel() {
    return this.get('web3').setup()
    .then(() => this.get('strikersContracts').loadAll())
    .then(() => {
      this.get('metamaskWatcher').start();
    });
  },

  model() {
    return this.get('currentUser').load();
  }
});
