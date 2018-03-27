import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend(ApplicationRouteMixin, {
  routeAfterAuthentication: 'my-album',
  web3: service(),
  actions: {
    didTransition() {
      if (!this.get('web3.waitingForSetup')) {
        return;
      }

      if (document.readyState === 'complete') {
        this._setupWeb3();
      } else {
        window.addEventListener('load', () => {
          this._setupWeb3();
        });
      }
      return true;
    }
  },

  _setupWeb3() {
    this.get('web3').setup();
    this.get('web3').loadAllContracts()
    .then(() => {
      this.controller.set('loadingWeb3', false);
    });
  }
});
