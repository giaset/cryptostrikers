import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  actions: {
    filterClicked(filter) {
      this.set('selectedFilter', filter);
    }
  },

  filters: computed('allPlayers', 'myCards', function() {
    const allPlayers = this.get('allPlayers');
    const myCards = this.get('myCards');
    const uniqueOwned = myCards.uniqBy('player.id');

    const filters = [{name: 'All', owned: uniqueOwned.length, total: allPlayers.get('length')}];

    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    groups.forEach(group => {
      const name = `Group ${group}`;
      const owned = uniqueOwned.filterBy('player.country.group', group).length;
      const total = allPlayers.filterBy('country.group', group).length;
      filters.push({name: name, owned: owned, total: total, group: group});
    });

    return filters;
  })
});
