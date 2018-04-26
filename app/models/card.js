import DS from 'ember-data';

export default DS.Model.extend({
  mintTime: DS.attr('date'),
  player: DS.belongsTo(),
  saleId: DS.attr('number'),
  serialNumber: DS.attr('number'),
  setId: DS.attr('number')
});
