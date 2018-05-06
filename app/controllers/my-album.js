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
  })
});
