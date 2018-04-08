import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  sorting: Object.freeze(['createdAt:desc']),
  sortedActivities: computed.sort('model', 'sorting')
});
