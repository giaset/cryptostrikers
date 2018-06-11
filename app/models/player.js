import DS from 'ember-data';

export default DS.Model.extend({
  bio: DS.attr('string'),
  country: DS.belongsTo('country', { inverse: null }),
  name: DS.attr('string'),
  wcInfo: DS.attr('string'),
  wiki: DS.attr('string')
});
