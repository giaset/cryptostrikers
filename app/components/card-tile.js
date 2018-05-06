import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: ['unowned:opacity-30'],
  classNames: ['card-tile', 'text-center'],

  ownedCount: computed('checklistItem', 'checklistItemToOwnedCount', function() {
    const checklistItemToOwnedCount = this.get('checklistItemToOwnedCount');
    if (!checklistItemToOwnedCount) {
      return 1;
    }

    return checklistItemToOwnedCount[this.get('checklistItem.id')] || 0;
  }),

  unowned: computed('ownedCount', function() {
    return this.get('ownedCount') <= 0;
  })
});
