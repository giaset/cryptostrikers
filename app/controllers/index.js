import Controller from '@ember/controller';
import ENV from 'cryptostrikers/config/environment';

export default Controller.extend({
  onlyShowLanding: ENV.strikers.onlyShowLanding,

  actions: {
    submitEmail() {
      this.set('emailButtonLoading', true);
      const newLead = this.store.createRecord('lead', {
        email: this.get('emailAddress')
      });
      newLead.save().then(() => {
        this.set('emailButtonLoading', false);
        this.set('thankYouMessage', 'Thanks for signing up! We\'ll be in touch soon.');
      });
    }
  }
});
