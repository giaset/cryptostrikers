import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(UnauthenticatedRouteMixin, {
  routeIfAlreadyAuthenticated: 'my-album',
  web3: service(),

  model() {
    return this.get('web3').generateSeedPhrase();
  },

  resetController(controller) {
    controller.set('currentStep', 0);
    controller.set('password', '');
  }
});
