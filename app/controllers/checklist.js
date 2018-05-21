import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),
  web3: service(),

  checklistItem: alias('model.checklistItem'),
  myCards: alias('model.myCards'),
  queryParams: ['card_id'],

  actions: {
    sellClicked(card, price) {
      console.log(`Selling card #${card.get('id')} for ${price} ETH.`);
      /*const contract = this.get('strikersContracts.StrikersCore.methods');
      const priceInWei = this.get('web3').toWei(price.toString());
      contract.listCardForSale(card.get('id'), priceInWei).send({
        from: this.get('currentUser.user.id')
      });*/
    },

    slideDidChange(index) {
      const myCardIds = this.get('myCards').mapBy('id');
      this.set('card_id', myCardIds.objectAt(index));
    }
  },

  card: computed('card_id', function() {
    const cardId = this.get('card_id');
    return this.get('_fetchCard').perform(cardId);
  }),

  _fetchCard: task(function * (cardId) {
    const card = yield this.get('store').findRecord('card', cardId);
    return card;
  })
});
