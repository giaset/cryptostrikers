import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  session: service(),
  web3: service(),
  currentlyLoading: false,
  currentStep: 0,
  errorMessage: null,
  password: '',
  seedWordStep: 0,
  passwordStep: 1,

  headerForCurrentStep: computed('currentStep', 'session.data.encryptedAccount', function() {
    if (this.get('session.data.encryptedAccount')) {
      return 'Please enter your CryptoStrikers password.';
    }

    switch(this.get('currentStep')) {
      case 0:
        return 'Seriously, please fucking read this.';
      case 1:
        return 'Ok. Now choose your CryptoStrikers password.';
    }
  }),

  actions: {
    // TO-DO: PASSWORD VALIDATION
    createAccount() {
      const seedPhrase = this.get('model');
      const password = this.get('password') || '';
      this.set('currentlyLoading', true);
      this.get('session').authenticate('authenticator:crypto', {seedPhrase: seedPhrase, password: password});
    },

    login() {
      const password = this.get('password') || '';
      this.set('currentlyLoading', true);
      this.get('session').authenticate('authenticator:crypto', {password: password})
      .catch(err => {
        this.set('currentlyLoading', false);
        this.set('password', '');
        this.set('errorMessage', err.message);
      });
    },

    goToNextStep() {
      this.incrementProperty('currentStep');
    }
  }
});
