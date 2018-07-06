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

  starCount: computed('checklistItem', 'checklistItemToStarCount', function() {
    const checklistItemToStarCount = this.get('checklistItemToStarCount');
    if (!checklistItemToStarCount) {
      return 0;
    }

    return checklistItemToStarCount[this.get('checklistItem.id')] || 0;
  }),

  starredFilepath: computed('checklistItem.filepath', 'starCount', function() {
    const starCount = this.get('starCount');
    const filepath = this.get('checklistItem.filepath');

    if (starCount > 0) {
      const components = filepath.split('.');
      // TODO: replace 1 with starCount
      for (let i = 0; i < 1; i++) {
        components[0] += '*';
      }
      return components.join('.');
    } else {
      return filepath;
    }
  }),

  unowned: computed('ownedCount', function() {
    return this.get('ownedCount') <= 0;
  })
});
