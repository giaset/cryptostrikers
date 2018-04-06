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
    return this.get('store').peekAll('player').filter(player => {
      return !['15', '16', '17', '18', '20', '21', '22', '23', '24'].includes(player.get('id'));
    });
  }
});
