import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  metamaskWatcher: service(),
  strikersContracts: service(),
  web3: service(),
  actions: {
    accessDenied() {
      this.transitionTo('sign-in');
    },

    didTransition() {
      this.get('web3').setup()
      .then(() => this.get('strikersContracts').loadAll())
      .then(() => {
        this.get('metamaskWatcher').start();
      })
      .finally(() => {
        // maybe delay this a little (and center the loading spinner)
        this.controller.set('loadingWeb3', false);
      });
      return true;
    }
  }
});
