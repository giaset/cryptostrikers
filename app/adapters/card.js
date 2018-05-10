import DS from 'ember-data';
import ENV from 'cryptostrikers/config/environment';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default DS.RESTAdapter.extend({
  strikersContracts: service(),

  findRecord(store, type, id) {
    const contract = this.get('strikersContracts.StrikersCore.methods');
    return contract.cards(id).call();
  },

  query(store, type, query) {
    const contract = this.get('strikersContracts.StrikersCore.methods');
    let cardIds;
    return contract.cardAndChecklistIdsForOwner(query.owner).call()
    .then(arrays => {
      cardIds = arrays[0];
      const promises = cardIds.map(cardId => contract.cards(cardId).call());
      return RSVP.all(promises);
    })
    .then(cards => {
      cards.forEach((card, index) => {
        const cardId = cardIds[index];
        card.id = cardId;
      });
      return { cards };
    });
  },

  urlForQuery() {
    return ENV.strikers.openSeaApi;
  }
});
