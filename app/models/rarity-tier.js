import DS from 'ember-data';

export default DS.Model.extend({
  limit: DS.attr('number'),
  name: DS.attr('string')
});
