import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';

export default Route.extend({
  currentUser: service(),
  strikersContracts: service(),
  web3: service(),

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
    const checklistId = params.checklist_item_id;
    const contract = this.get('strikersContracts.StrikersCore.methods');
    const owner = this.get('currentUser.user.id');
    const store = this.get('store');

    const myCards = contract.cardAndChecklistIdsForOwner(owner).call().then(arrays => {
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

    return RSVP.hash({
      checklistItem: store.findRecord('checklist-item', checklistId),
      myCards
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    // https://github.com/emberjs/ember.js/issues/5465
    next(this, () => {
      controller.set('card_id', model.myCards.get('firstObject.id'));
    });
  }
});
