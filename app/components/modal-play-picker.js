import ModalComponent from 'ember-modal-service/components/modal';
import { computed } from '@ember/object';

export default ModalComponent.extend({
  classNames: ['modal-play-picker'],

  didInsertElement() {
    this._super(...arguments);
    const options = this.get('model.options');
    const acceptedChecklistIds = options.acceptedChecklistItems.mapBy('id');
    const cards = options.myCards.filter(card => {
      const checklistId = card.get('checklistItem.id');
      if (parseInt(checklistId) >= 100) {
        return false;
      }

      return acceptedChecklistIds.includes(checklistId);
    });

    if (cards.length > 0) {
      this.set('cards', cards);
    } else {
      this.set('noCards', true);
    }
  },

  acceptedPlayersString: computed('model.options.acceptedChecklistItems', function() {
    const playerNames = this.get('model.options.acceptedChecklistItems').mapBy('player.name');
    return playerNames.uniq().join(', ');
  })
});
