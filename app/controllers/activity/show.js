import Controller from '@ember/controller';
import { cancel, later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Controller.extend({
  strikersContracts: service(),
  web3: service(),
  interval: 1000,
  nextRefresh: null,

  startRefreshing() {
    this.set('isLoading', true);
    this._tick();
  },

  stopRefreshing() {
    cancel(this.get('nextRefresh'));
    this.set('nextRefresh', null);
  },

  _tick() {
    const hash = this.get('model.txnHash');
    this.get('web3').getTransactionReceipt(hash).then(receipt => {
      if (receipt) {
        const cardIds = this.get('strikersContracts').getCardIdsFromPackBoughtReceipt(receipt);
        return this._loadCards(cardIds);
      } else {
        this.set('message', 'Hang tight, this transaction hasn\'t been mined yet...');
        this.set('nextRefresh', later(this, this._tick, this.interval));
      }
    });
  },

  _loadCards(cardIds) {
    const contract = this.get('strikersContracts.StrikersMinting.methods');
    const store = this.get('store');
    const promises = cardIds.map(cardId => contract.cards(cardId).call());
    return RSVP.all(promises).then(cards => {
      const cardObjects =  cards.map((card, index) => {
        const cardId = cardIds[index];
        const payload = {
          id: cardId,
          mintNumber: card.mintNumber,
          mintTime: parseInt(card.mintTime) * 1000,
          player: card.playerId,
          runId: card.runId,
          seriesId: card.seriesId
        };
        store.pushPayload('card', {card: payload});
        return store.peekRecord('card', cardId);
      });
      this.set('isLoading', false);
      this.set('message', null);
      this.set('cards', cardObjects);
    });
  }
});
