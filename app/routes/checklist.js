import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';

export default Route.extend({
  currentUser: service(),
  strikersContracts: service(),
  web3: service(),
  queryParams: {
    card_id: {
      replace: true
    }
  },

  actions: {
    error() {
      // TODO: this is wonky, why can't we go to 404?
      this.replaceWith('index');
    }
  },

  // TODO: all these beforeModel checks should be mixins
  // (also check MM locked state)
  beforeModel() {
    if (this.get('web3.wrongNetwork')) {
      this.transitionTo('sign-in');
    }
  },

  model(params) {
    const cardId = params.card_id;
    const checklistId = params.checklist_item_id;

    const contract = this.get('strikersContracts.StrikersCore.methods');
    const store = this.get('store');

    let cards;
    let owner;
    if (cardId) {
      cards = RSVP.all([store.findRecord('card', cardId)]);
      owner = contract.ownerOf(cardId).call().then(address => store.findRecord('user-metadata', address));
    } else {
      const myAddress = this.get('currentUser.address');
      cards = contract.cardAndChecklistIdsForOwner(myAddress).call().then(arrays => {
        const cardIds = arrays[0];
        const checklistIds = arrays[1];
        const cardIdsForThisChecklistId = [];
        checklistIds.forEach((id, index) => {
          if (id.padStart(3, '0') === checklistId) {
            cardIdsForThisChecklistId.push(cardIds[index]);
          }
        });
        const promises = cardIdsForThisChecklistId.map(cardId => store.findRecord('card', cardId));
        return RSVP.all(promises);
      });
      owner = store.findRecord('user-metadata', myAddress);
    }

    return RSVP.hash({
      cards,
      checklistItem: store.findRecord('checklist-item', checklistId),
      owner
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    // https://github.com/emberjs/ember.js/issues/5465
    next(this, () => {
      controller.set('card_id', model.cards.get('firstObject.id'));
    });
  }
});
