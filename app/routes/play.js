import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({
  currentUser: service(),
  strikersContracts: service(),

  model() {
    const store = this.get('store');
    const games = store.findAll('game');
    const owner = this.get('currentUser.address');
    const myCards = store.query('card', { owner });
    const myChecklistItems = myCards.then(cards => cards.mapBy('checklistItem'));
    const myPicks = this.get('strikersContracts.StrikersUpdate.methods').getPicksForUser(owner).call().then(cardIds => cardIds.map(cardId => store.findRecord('card', cardId)));

    return RSVP.hash({
      games,
      myCards,
      myChecklistItems,
      myPicks
    });
  }
});
