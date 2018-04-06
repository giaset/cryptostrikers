import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  strikersContracts: service(),
  web3: service(),

  beforeModel() {
    if (this.get('web3.wrongNetwork')) {
      this.transitionTo('sign-in');
    }
  },

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
