import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['filterable-card-grid'],
  selectedSetId: '0',

  filteredItems: computed('checklistItems', 'selectedSetId', function() {
    const selectedSetId = this.get('selectedSetId');
    return this.get('checklistItems').filterBy('set.id', selectedSetId);
  })
});
