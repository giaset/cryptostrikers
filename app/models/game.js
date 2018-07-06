import DS from 'ember-data';

export default DS.Model.extend({
  acceptedChecklistItems: DS.hasMany('checklist-item'),
  awayTeam: DS.belongsTo('country'),
  homeTeam: DS.belongsTo('country'),
  startTime: DS.attr('date')
});
