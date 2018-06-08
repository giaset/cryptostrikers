import DS from 'ember-data';

export default DS.Model.extend({
  bonusPlayerName: DS.attr('string'),
  commissionAmount: DS.attr('string'),
  createdAt: DS.attr('date'),
  kittyId: DS.attr('string'),
  premium: DS.attr('boolean'),
  trade: DS.belongsTo('trade', { inverse: null }),
  txnHash: DS.attr('string'),
  type: DS.attr('string'),
  user: DS.belongsTo('user', { inverse: null })
});
