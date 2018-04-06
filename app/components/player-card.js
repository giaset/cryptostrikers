import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['player-card', 'card', 'mb-4', 'box-shadow'],

  hasImage: computed('safePlayer.id', function() {
    const noImage = ['15', '16', '17', '18', '20', '21', '22', '23', '24'];
    return !noImage.includes(this.get('safePlayer.id'));
  }),

  safePlayer: computed('card.player', 'player', function() {
    return this.get('card.player') || this.get('player');
  })
});
