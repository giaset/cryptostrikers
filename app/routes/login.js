import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  web3: service(),

  model() {
    return this.get('web3').generateSeedPhrase();
  },

  resetController(controller) {
    controller.set('currentStep', 0);
    controller.set('password', '');
  }
});
