import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  actions: {
    closeSession() {
      this.get('session').close().then(() => {
        this.get('currentUser').unload();
        this.store.unloadAll();
        this.transitionToRoute('index');
      });
    }
  }
});
