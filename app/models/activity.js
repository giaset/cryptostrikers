import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: DS.attr('date'),
  event: DS.attr(),
  txnHash: DS.attr('string'),
  type: DS.attr('string'),
  user: DS.belongsTo('user', {inverse: null})
});
