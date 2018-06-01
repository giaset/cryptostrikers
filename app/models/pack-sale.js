import DS from 'ember-data';

export default DS.Model.extend({
  featuredChecklistItem: DS.belongsTo('checklist-item'),
  packPrice: DS.attr('string'),
  packsLoaded: DS.attr('number'),
  packsSold: DS.attr('number')
});
