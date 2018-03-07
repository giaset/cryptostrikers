import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  web3: service(),

  actions: {
    createAccount() {
      const privateKey = this.get('model').privateKey;
      const password = this.get('password');
      const encryptedAccount = this.get('web3').encryptAccount(privateKey, password);
      this.set('encryptedAccount', JSON.stringify(encryptedAccount));
    }
  }
});
