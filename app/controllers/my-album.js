import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  ownedPlayers: computed('model.myCards', function() {
    const ownedMap = {};
    this.get('model.myCards').forEach(card => {
      ownedMap[card.get('player.id')] = true;
    });
    return ownedMap;
  })
});
