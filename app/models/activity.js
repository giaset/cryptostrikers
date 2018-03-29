import DS from 'ember-data';

export default DS.Model.extend({
  txnHash: DS.attr('string'),
  user: DS.belongsTo('user', {inverse: null})
});
