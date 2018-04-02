import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  strikersContracts: service(),

  model(params) {
    const store = this.get('store');
    return store.findRecord('activity', params.activity_id)
    .then(activity => activity.get('txnHash'));
  }
});
