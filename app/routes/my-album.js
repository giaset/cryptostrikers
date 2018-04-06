import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  web3: service(),

  beforeModel() {
    if (this.get('web3.wrongNetwork')) {
      this.transitionTo('sign-in');
    }
  },

  model() {
    return this.get('store').peekAll('player');
  }
});
