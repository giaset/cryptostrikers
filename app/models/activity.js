import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: DS.attr('date'),
  kittyId: DS.attr('string'),
  makerCardId: DS.attr('string'),
  taker: DS.attr('string'),
  takerCardOrChecklistId: DS.attr('string'),
  txnHash: DS.attr('string'),
  type: DS.attr('string'),
  user: DS.belongsTo('user', { inverse: null })
});
