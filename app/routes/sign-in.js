import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  web3: service(),

  beforeModel() {
    if (this.get('session.isAuthenticated') && !this.get('web3.wrongNetwork')) {
      this.transitionTo('my-album');
    } else {
      return this._super(...arguments);
    }
  }
});
