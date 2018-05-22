import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['email-capture-page'],
  store: service(),
  actions: {
    createLead(emailAddress) {
      if (!this.get('leadCreated')) {
        this.get('createLeadTask').perform(emailAddress);
      }
    }
  },

  createLeadTask: task(function * (emailAddress) {
    const newLead = this.get('store').createRecord('lead', {
      email: emailAddress
    });
    yield newLead.save();
    this.set('leadCreated', true);
  }).drop()
});
