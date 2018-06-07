import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['referrals-earnings', 'text-center'],

  unclaimedEarnings: computed('referralCommissionClaimed', 'referralCommissionEarned', function() {
    return this.get('referralCommissionEarned') - this.get('referralCommissionClaimed');
  })
});
