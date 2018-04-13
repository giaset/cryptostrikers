import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  filteredPlayers: computed('model.allPlayers', 'selectedFilter', function() {
    const allPlayers = this.get('model.allPlayers');
    const selectedFilter = this.get('selectedFilter');

    if (selectedFilter && selectedFilter.group) {
      return allPlayers.filterBy('country.group', selectedFilter.group);
    }

    return allPlayers;
  }),

  ownedPlayers: computed('model.myCards', function() {
    const ownedMap = {};
    this.get('model.myCards').forEach(card => {
      ownedMap[card.get('player.id')] = true;
    });
    return ownedMap;
  })
});
