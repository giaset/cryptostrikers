import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import RSVP from 'rsvp';
import { run } from '@ember/runloop';

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
    return this.get('web3').setup()
    .then(() => this.get('strikersContracts').loadAll(jsonPrefix))
    .then(() => {
      this.get('metamaskWatcher').start();
    });
  },

  model(_, transition) {
    const jsonPrefix = this._jsonPrefix(transition);
    const store = this.get('store');
    const countriesPromise = $.getJSON(`${jsonPrefix}countries.json`)
    .then(json => {
      run(() => {
        store.pushPayload('country', json);
      });
    });
    const playersPromise = countriesPromise.then(() => $.getJSON(`${jsonPrefix}players.json`))
    .then(json => {
      run(() => {
        store.pushPayload('player', json);
      });
    });
    const userPromise = this.get('currentUser').load();
    return RSVP.hash({
      players: playersPromise,
      user: userPromise
    });
  },

  _jsonPrefix(transition) {
    const isNestedRoute = transition.targetName === 'activity.index' || transition.targetName === 'activity.show';
    return isNestedRoute ? '../' : '';
  }
});
