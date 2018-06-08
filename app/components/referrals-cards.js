import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['referrals-cards', 'row'],

  firstUnclaimedCard: computed('hasUnclaimedCard', function() {
    return this.get('hasUnclaimedCard') ? this.get('bonusCardsClaimed') : -1;
  }),

  hasUnclaimedCard: computed('attributedSales', 'bonusCardsClaimed', function() {
    const attributedSales = this.get('attributedSales');
    const bonusCardsClaimed = this.get('bonusCardsClaimed');
    return attributedSales > bonusCardsClaimed && bonusCardsClaimed < 8;
  })
});
