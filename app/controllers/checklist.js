import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Controller.extend({
  cards: alias('model.cards'),
  checklistItem: alias('model.checklistItem'),
  queryParams: ['card_id'],

  actions: {
    slideDidChange(index) {
      const cardIds = this.get('cards').mapBy('id');
      this.set('card_id', cardIds.objectAt(index));
    }
  },

  card: computed('card_id', 'cards', function() {
    const cardId = this.get('card_id');
    if (cardId) {
      return this.get('cards').findBy('id', cardId);
    }
  })
});
