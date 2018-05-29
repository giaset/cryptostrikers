import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isBadRequestError } from 'ember-ajax/errors';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['email-capture-page'],
  ajax: service(),
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
      if (isBadRequestError(error)) {
        this.set('error', error.payload.title);
      }
    }
  }).drop()
});
