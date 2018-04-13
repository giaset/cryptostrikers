import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({
  currentUser: service(),
  web3: service(),

  beforeModel() {
    if (this.get('web3.wrongNetwork')) {
      this.transitionTo('sign-in');
    }
  },

  model() {
    const store = this.get('store');
    return RSVP.hash({
      allPlayers: store.peekAll('player'),
      myCards: store.query('card', {owner: this.get('currentUser.user.id')})
    });
  }
});
