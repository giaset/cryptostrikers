import DS from 'ember-data';

export default DS.Model.extend({
  group: DS.attr('string'),
  isoCode: DS.attr('string'),
  mauAccent: DS.attr(),
  name: DS.attr('string')
});
