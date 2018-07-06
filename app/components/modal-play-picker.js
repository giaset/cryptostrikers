import ModalComponent from 'ember-modal-service/components/modal';
import { computed } from '@ember/object';

export default ModalComponent.extend({
  classNames: ['modal-play-picker'],

  didInsertElement() {
    this._super(...arguments);
    const options = this.get('model.options');
    const acceptedPlayerIds = options.acceptedPlayers.mapBy('id');
    const cards = options.myCards.filter(card => {
      if (parseInt(card.get('checklistItem.id')) >= 100) {
        return false;
      }

      const playerId = card.get('checklistItem.player.id');
      return acceptedPlayerIds.includes(playerId);
    });

    if (cards.length > 0) {
      this.set('cards', cards);
    } else {
      this.set('noCards', true);
    }
  },

  acceptedPlayersString: computed('model.options.acceptedPlayers', function() {
    return this.get('model.options.acceptedPlayers').mapBy('name').join(', ');
  })
});
