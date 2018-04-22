import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'cryptostrikers/config/environment';
import RSVP from 'rsvp';

export default Route.extend({
  currentUser: service(),
  strikersContracts: service(),
  web3: service(),

  beforeModel() {
    if (this.get('web3.wrongNetwork')) {
      this.transitionTo('sign-in');
    }
  },

  model() {
    const owner = this.get('currentUser.user.id');
    const store = this.get('store');

    const contract = this.get('strikersContracts.StrikersMinting.methods');
    const myCards = contract.cardIdsForOwner(owner).call().then(cardIds => {
      const promises = cardIds.map(cardId => store.findRecord('card', cardId));
      return RSVP.all(promises);
    });

    return RSVP.hash({
      allPlayers: store.peekAll('player'),
      myCards
    });
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('selectedFilter', null);
    }
  }
});
