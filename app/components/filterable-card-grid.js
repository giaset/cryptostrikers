import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['filterable-card-grid'],
  onlyShowOwned: true,
  selectedSetId: '0',

  filteredItems: computed('checklistItems', 'checklistItemToOwnedCount', 'onlyShowOwned', 'selectedSetId', function() {
    const checklistItemToOwnedCount = this.get('checklistItemToOwnedCount');
    const onlyShowOwned = this.get('onlyShowOwned');
    const selectedSetId = this.get('selectedSetId');
    return this.get('checklistItems').filter(checklistItem => {
      const setId = checklistItem.get('set.id');
      if (setId !== selectedSetId) {
        return false;
      }

      const checklistId = checklistItem.get('id');
      if (onlyShowOwned && !checklistItemToOwnedCount[checklistId]) {
        return false;
      }

      return true;
    });
  }),

  checklistItemToOwnedCount: computed('myCards', function() {
    const ownedMap = {};
    this.get('myCards').forEach(card => {
      const checklistId = card.get('checklistItem.id');
      ownedMap[checklistId] = (ownedMap[checklistId] + 1) || 1;
    });
    return ownedMap;
  })
});
