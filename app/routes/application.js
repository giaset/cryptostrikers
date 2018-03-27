import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend(ApplicationRouteMixin, {
  routeAfterAuthentication: 'my-album',
  strikersContracts: service(),
  web3: service(),
  actions: {
    didTransition() {
      this.get('web3').setup()
      .then(() => this.get('strikersContracts').loadAll())
      .then(() => {
        this.controller.set('loadingWeb3', false);
      });
      return true;
    }
  }
});
