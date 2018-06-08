import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentUser: service(),

  beforeModel() {
    const address = this.get('currentUser.address');
    this.transitionTo('profile', address);
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('selectedFilter', null);
    }
  }
});
