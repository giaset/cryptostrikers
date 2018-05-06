import DS from 'ember-data';

export default DS.Model.extend({
  checklistItem: DS.belongsTo(),
  mintTime: DS.attr('date'),
  sale: DS.belongsTo(),
  serialNumber: DS.attr('number')
});
