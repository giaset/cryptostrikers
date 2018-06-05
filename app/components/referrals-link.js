import Component from '@ember/component';

export default Component.extend({
  classNames: ['referrals-link', 'row'],
  actions: {
    copySuccess() {
      console.log('copy');
    },

    createReferralCode(referralCode) {
      console.log(referralCode);
    }
  }
});
