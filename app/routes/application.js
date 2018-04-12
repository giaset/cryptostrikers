import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

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

  beforeModel(transition) {
    const jsonPrefix = this._jsonPrefix(transition);
    const web3 = this.get('web3');
    return web3.setup()
    .then(() => web3.checkNetwork())
    .then(() => this.get('strikersContracts').loadAll(jsonPrefix))
    .then(() => {
      this.get('metamaskWatcher').start();
    })
    .catch(() => {});
  },

  model() {
    const store = this.get('store');
    return RSVP.hash({
      countries: store.findAll('country'),
      players: store.findAll('player'),
      // This has to be done after auth, which happens in beforeModel.
      user: this.get('currentUser').load()
    });
  },

  _jsonPrefix(transition) {
    const isNestedRoute = transition.targetName === 'activity.index' || transition.targetName === 'activity.show';
    return isNestedRoute ? '../' : '';
  }
});
