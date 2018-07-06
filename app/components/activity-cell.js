import Component from '@ember/component';
import { computed } from '@ember/object';

const BUY_TYPES = {
  buy_pack: true,
  buy_pack_with_kitty: true
};

const TRADE_TYPES = {
  cancel_trade: true,
  create_trade: true,
  fill_trade: true
};

export default Component.extend({
  classNames: ['activity-cell'],

  activityImage: computed('activity.type', function() {
    const type = this.get('activity.type');
    let image = 'sell';

    if (BUY_TYPES[type] || type === 'make_pick') {
      image = 'buy';
    } else if (TRADE_TYPES[type]) {
      image = 'trade';
    }

    return `/assets/images/activity-${image}.svg`;
  }),

  showViewCards: computed('activity.type', function() {
    const type = this.get('activity.type');
    return BUY_TYPES[type] || type === 'claim_whitelist_pack' || type === 'claim_referral_pack';
  })
});
