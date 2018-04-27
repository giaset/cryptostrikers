import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
  strikersContracts: service(),
  web3: service(),

  getCardsFromTransaction: task(function * () {
    this.set('cards', null);
    this.set('openPackClicked', false);
    const hash = this.get('model.activity.txnHash');
    const receipt = yield this.get('web3').getTransactionReceipt(hash);
    if (receipt) {
      const cardIds = this.get('strikersContracts').getCardIdsFromPackBoughtReceipt(receipt);
      const cards = yield this._loadCards(cardIds);
      this.set('cards', cards);
    } else {
      this.set('firstCheckDone', true);
      yield timeout(1000);
      this.get('getCardsFromTransaction').perform();
    }
  }),

  _loadCards(cardIds) {
    const store = this.get('store');
    const promises = cardIds.map(cardId => store.findRecord('card', cardId));
    return RSVP.all(promises);
  }
});
