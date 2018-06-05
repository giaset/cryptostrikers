import Component from '@ember/component';
import ENV from 'cryptostrikers/config/environment';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  baseUrl: ENV.strikers.baseUrl,
  classNames: ['referrals-link', 'row'],
  currentUser: service(),
  store: service(),
  actions: {
    copySuccess() {
      this.get('flashCopied').perform();
    },

    createReferralCode(referralCode) {
      this.set('errorMessage', null);
      this.get('store').findRecord('referral-code', referralCode)
      .then(() => {
        this.set('errorMessage', 'This referral code is already in use.');
      })
      .catch(() => this._createReferralCode(referralCode));
    }
  },

  flashCopied: task(function * () {
    this.set('flashText', true);
    yield timeout(1500);
    this.set('flashText', false);
  }).drop(),

  referralUrl: computed('referralCode.id', function() {
    const baseUrl = this.get('baseUrl');
    const referralCode = this.get('referralCode.id');
    return `${baseUrl}invite/${referralCode}`;
  }),

  _createReferralCode(id) {
    const store = this.get('store');
    const user = this.get('currentUser.user');
    const referralCode = store.createRecord('referral-code', { id, user });
    user.set('referralCode', referralCode);
    return referralCode.save()
    .then(() => user.save())
    .then(() => {
      this.set('referralCode', referralCode);
    });
  }
});
