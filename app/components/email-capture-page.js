import Component from '@ember/component';
import ENV from 'cryptostrikers/config/environment';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['email-capture-page'],
  ajax: service(),
  onlyShowLanding: ENV.strikers.onlyShowLanding,

  actions: {
    createLead(emailAddress) {
      if (!this.get('subscriptionSuccessful')) {
        this.set('error', null);
        this.get('subscribeTask').perform(emailAddress);
      }
    }
  },

  subscribeTask: task(function * (emailAddress) {
    const data = { email_address: emailAddress };
    try {
      yield this.get('ajax').post('subscribe', { data });
      this.set('subscriptionSuccessful', true);
    } catch(error) {
      this.set('error', 'Email address already subscribed.');
    }
  }).drop()
});
