import DS from 'ember-data';

export default DS.Model.extend({
  country: DS.belongsTo('country', { inverse: null }),
  name: DS.attr('string')
});
