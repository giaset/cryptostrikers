import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    const store = this.get('store');
    return RSVP.hash({
      checklistItems: store.findAll('checklistItem'),
      sets: store.findAll('set')
    });
  }
});
