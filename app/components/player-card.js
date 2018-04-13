import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: ['inactive'],
  classNames: ['player-card', 'card', 'mb-4', 'box-shadow'],

  inactive: computed('ownedPlayers', 'safePlayer', function() {
    const ownedPlayers = this.get('ownedPlayers');
    if (!ownedPlayers) {
      return false;
    }

    return !ownedPlayers[this.get('safePlayer.id')];
  }),

  safePlayer: computed('card.player', 'player', function() {
    return this.get('card.player') || this.get('player');
  })
});
