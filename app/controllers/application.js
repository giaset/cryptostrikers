import Controller from '@ember/controller';
import ENV from 'cryptostrikers/config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  onlyShowLanding: ENV.strikers.onlyShowLanding,
  actions: {
    closeSession() {
      this.get('session').close().then(() => {
        window.location.replace('/');
      });
    }
  }
});
