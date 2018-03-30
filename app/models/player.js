import DS from 'ember-data';

export default DS.Model.extend({
  country: DS.belongsTo('country'),
  name: DS.attr('string')
});
