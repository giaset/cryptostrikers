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

  beforeModel() {
    return this.get('web3').setup()
    .then(() => this.get('strikersContracts').loadAll())
    .then(() => {
      this.get('metamaskWatcher').start();
    });
  },

  model() {
    const store = this.get('store');
    const countriesPromise = $.getJSON('countries.json')
    .then(json => {
      run(() => {
        store.pushPayload('country', json);
      });
    });
    const playersPromise = countriesPromise.then(() => $.getJSON('players.json'))
    .then(json => {
      run(() => {
        store.pushPayload('player', json);
      });
    });
    const userPromise = this.get('currentUser').load();
    return RSVP.all[playersPromise, userPromise];
  }
});
