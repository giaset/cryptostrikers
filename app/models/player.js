import DS from 'ember-data';

export default DS.Model.extend({
  country: DS.belongsTo(),
  name: DS.attr('string')
});
