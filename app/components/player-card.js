import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['player-card', 'card', 'mb-4', 'box-shadow'],

  safePlayer: computed('card.player', 'player', function() {
    return this.get('card.player') || this.get('player');
  })
});
