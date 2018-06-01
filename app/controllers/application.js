import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  actions: {
    closeSession() {
      this.get('session').close().then(() => {
        window.location.replace('/');
      });
    }
  }
});
