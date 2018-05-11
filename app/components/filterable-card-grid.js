import Component from '@ember/component';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';

export default Component.extend({
  classNames: ['filterable-card-grid'],
  onlyShowOwned: true,
  selectedSetId: '0',

  ownsZeroCards: computed('checklistItemToOwnedCount', function() {
    return Object.keys(this.get('checklistItemToOwnedCount')).length === 0;
  }),

  filteredItems: computed('checklistItems.[]', 'checklistItemToOwnedCount', 'onlyShowOwned', 'selectedSetId', 'searchQuery', function() {
    const checklistItemToOwnedCount = this.get('checklistItemToOwnedCount');
    const onlyShowOwned = this.get('onlyShowOwned');
    const selectedSetId = this.get('selectedSetId');
    const searchQuery = this.get('searchQuery');
    const formattedQuery = isBlank(searchQuery) ? null : searchQuery.toLowerCase();
    const sortedChecklistItems = this.get('checklistItems').sortBy('id');
    return sortedChecklistItems.filter(checklistItem => {
      const setId = checklistItem.get('set.id');
      if (setId !== selectedSetId) {
        return false;
      }

      const checklistId = checklistItem.get('id');
      if (onlyShowOwned && !checklistItemToOwnedCount[checklistId]) {
        return false;
      }

      if (!formattedQuery) {
        return true;
      }

      const formattedName = checklistItem.get('player.name').toLowerCase();
      return formattedName.includes(formattedQuery);
    });
  }),

  checklistItemToOwnedCount: computed('myChecklistIds', function() {
    const ownedMap = {};
    this.get('myChecklistIds').forEach(checklistId => {
      ownedMap[checklistId] = (ownedMap[checklistId] + 1) || 1;
    });
    return ownedMap;
  })
});
