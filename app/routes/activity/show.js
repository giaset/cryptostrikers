import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({
  strikersContracts: service(),

  model(params) {
    let cardIds;
    return this.get('store').findRecord('activity', params.activity_id).then(activity => {
      cardIds = activity.get('event.args');
      const contract = this.get('strikersContracts.StrikersSale');
      const promises = cardIds.map(cardId => contract.cards(cardId));
      return RSVP.all(promises);
    })
    .then(cards => {
      const store = this.get('store');
      const result = [];
      cards.forEach((card, index) => {
        const cardId = cardIds[index];
        const payload = {
          id: cardId,
          mintNumber: card[1].toNumber(),
          mintTime: card[0].toNumber() * 1000,
          player: card[2].toNumber(),
          runId: card[4].toNumber(),
          seriesId: card[3].toNumber()
        };
        store.pushPayload('card', {card: payload});
        result.push(store.peekRecord('card', cardId));
      });
      return result;
    });
  }
});
