import Route from '@ember/routing/route';

export default Route.extend({
  afterModel(model) {
    this.transitionTo('sign-in', { queryParams: { referral_code: model.get('id') }});
  }
});
