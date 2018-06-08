import DS from 'ember-data';
import ENV from 'cryptostrikers/config/environment';
import { computed } from '@ember/object';

export default DS.Model.extend({
  bonusPlayerName: DS.attr('string'),
  commissionAmount: DS.attr('string'),
  createdAt: DS.attr('date'),
  kittyId: DS.attr('string'),
  premium: DS.attr('boolean'),
  trade: DS.belongsTo('trade', { inverse: null }),
  tradeString: DS.attr('string'),
  txnHash: DS.attr('string'),
  type: DS.attr('string'),
  user: DS.belongsTo('user', { inverse: null }),

  etherscanUrl: computed('txnHash', function() {
    return `${ENV.strikers.etherscanUrl}tx/${this.get('txnHash')}`;
  })
});
