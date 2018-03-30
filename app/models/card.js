import DS from 'ember-data';

export default DS.Model.extend({
  mintNumber: DS.attr('number'),
  mintTime: DS.attr('date'),
  player: DS.belongsTo('player'),
  runId: DS.attr('number'),
  seriesId: DS.attr('number')
});
