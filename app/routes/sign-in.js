import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    if (this.get('session.isAuthenticated')) {
      this.transitionTo('my-album');
    } else {
      return this._super(...arguments);
    }
  }
});
