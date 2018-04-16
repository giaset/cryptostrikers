import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({
  currentUser: service(),
  metamaskWatcher: service(),
  strikersContracts: service(),
  web3: service(),
  worldCupInfo: service(),
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
    return RSVP.hash({
      stats: this.get('store').findRecord('stats', 'stats'),
      // user load has to be done after auth, which happens in beforeModel
      user: this.get('currentUser').load(),
      worldCupInfo: this.get('worldCupInfo').setup()
    });
  },

  _jsonPrefix(transition) {
    const isNestedRoute = transition.targetName === 'activity.index' || transition.targetName === 'activity.show';
    return isNestedRoute ? '../' : '';
  }
});
