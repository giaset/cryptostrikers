import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: ['inactive'],
  classNames: ['player-card', 'mb-4', 'box-shadow'],

  inactive: computed('ownedCount', function() {
    return this.get('ownedCount') <= 0;
  }),

  ownedCount: computed('playerToOwnedCount', 'safePlayer', function() {
    const playerToOwnedCount = this.get('playerToOwnedCount');
    if (!playerToOwnedCount) {
      return 1;
    }

    const ownedCount = playerToOwnedCount[this.get('safePlayer.id')];
    return ownedCount || 0;
  }),

  safePlayer: computed('card.player', 'player', function() {
    return this.get('card.player') || this.get('player');
  })
});
