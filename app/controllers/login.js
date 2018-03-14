import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),

  actions: {
    createAccount() {
      const seedPhrase = this.get('model');
      this.get('session').authenticate('authenticator:crypto', {seedPhrase: seedPhrase});
    }
  }
});
