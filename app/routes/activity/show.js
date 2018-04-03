import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  strikersContracts: service(),

  model(params) {
    return this.get('store').findRecord('activity', params.activity_id);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.startRefreshing();
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.stopRefreshing();
      controller.set('cards', null);
    }
  }
});
