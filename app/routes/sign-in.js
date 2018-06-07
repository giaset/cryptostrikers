import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  metamaskWatcher: service(),
  strikersContracts: service(),
  web3: service(),

  beforeModel() {
    const web3 = this.get('web3');
    if (this.get('session.isAuthenticated') && web3.get('metamaskDetected') && !web3.get('wrongNetwork')) {
      this.transitionTo('my-album');
    } else {
      return this._super(...arguments);
    }
  },

  // TODO: needs to update if user changes account?
  model(params) {
    let referralCode = params.referral_code;
    if (referralCode) {
      localStorage.setItem('referralCode', referralCode);
    } else {
      referralCode = localStorage.getItem('referralCode');
    }

    const store = this.get('store');
    const currentAccount = this.get('metamaskWatcher.currentAccount');
    const existingUser = currentAccount ? store.findRecord('user-metadata', currentAccount).catch(() => {}) : null;
    const referralPacksClaimed = this.get('strikersContracts.StrikersPackSale.methods').freeReferralPacksClaimed().call();
    const referrer = referralCode ? store.findRecord('referral-code', referralCode).then(code => code.get('userMetadata')).catch(() => {}) : null;

    return RSVP.hash({
      existingUser,
      referralPacksClaimed,
      referrer
    });
  }
});
