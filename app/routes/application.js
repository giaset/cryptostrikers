import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({
  currentUser: service(),
  intl: service(),
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
    const intlSetup = this.get('intl').setLocale('en-us');

    const jsonPrefix = this._jsonPrefix(transition);
    const web3 = this.get('web3');
    const web3Setup = web3.setup()
    .then(() => web3.checkNetwork())
    .then(() => this.get('strikersContracts').loadAll(jsonPrefix))
    .then(() => {
      this.get('metamaskWatcher.startWatching').perform();
    })
    .catch(() => {});

    const starCounts = this.get('store').findRecord('starCounts', 'starCounts');

    return RSVP.all([intlSetup, web3Setup, starCounts]);
  },

  model() {
    return RSVP.hash({
      // user load has to be done after auth, which happens in beforeModel
      user: this.get('currentUser').load(),
      worldCupInfo: this.get('worldCupInfo').setup()
    });
  },

  // TODO: this is really ugly...
  _jsonPrefix(transition) {
    const nestedRoutes = [
      'activity.index', 'activity.show', 'checklist', 'sales', 'trades',
      'dashboard.index', 'dashboard.checklist', 'dashboard.pack-factory',
      'invite', 'dashboard.pack-sale', 'dashboard.whitelist', 'profile',
      'kitty-exchange.1', 'kitty-exchange.2', 'kitty-exchange.3',
      'dashboard.key-metrics', 'dashboard.trading', 'dashboard.predictions'
    ];
    const isNestedRoute = nestedRoutes.includes(transition.targetName);
    return isNestedRoute ? '../' : '';
  }
});
