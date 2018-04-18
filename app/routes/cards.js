import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    error() {
      this.replaceWith('index');
    }
  },

  // TODO: all these beforeModel checks should be mixins
  // (also check MM locked state)
  beforeModel() {
    if (this.get('web3.wrongNetwork')) {
      this.transitionTo('sign-in');
    }
  }
});
