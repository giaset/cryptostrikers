import DS from 'ember-data';

export default DS.Model.extend({
  tradingContractAddress: DS.attr('string'),
  maker: DS.attr('string'),
  makerCardId: DS.attr('string'),
  taker: DS.attr('string'),
  takerCardOrChecklistId: DS.attr('string'),
  salt: DS.attr('number'),
  signedHash: DS.attr('string')
});
