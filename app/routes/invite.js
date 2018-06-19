import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    const referralCode = params.referral_code_id;
    if (referralCode) {
      return this.get('store').findRecord('referral-code', referralCode).catch(() => {});
    }
  },

  afterModel(model) {
    if (model) {
      this.transitionTo('sign-in', { queryParams: { referral_code: model.get('id') }});
    } else {
      this.transitionTo('sign-in');
    }
  }
});
