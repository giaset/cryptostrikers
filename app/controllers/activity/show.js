import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),
  web3: service(),

  getCardsFromTransaction: task(function * () {
    const contract = this.get('strikersContracts.StrikersPackSale');
    const filter = { buyer: this.get('currentUser.address') };
    const events = yield contract.getPastEvents('PackBought', { filter, fromBlock: 0 });
    const hash = this.get('model.activity.txnHash');
    const event = events.findBy('transactionHash', hash);
    if (event) {
      const cardIds = event.returnValues.pack;
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
