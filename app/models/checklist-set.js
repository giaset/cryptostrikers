import DS from 'ember-data';

export default DS.Model.extend({
  descriptor: DS.attr('string'),
  name: DS.attr('string')
});
