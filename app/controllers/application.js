import Controller from '@ember/controller';

export default Controller.extend({
  loadingWeb3: true,
  actions: {
    closeSession() {
      this.get('session').close().then(() => {
        this.transitionToRoute('index');
      });
    }
  }
});
