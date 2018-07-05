import DS from 'ember-data';

export default DS.Model.extend({
  acceptedPlayers: DS.hasMany('player'),
  awayTeam: DS.belongsTo('country'),
  homeTeam: DS.belongsTo('country'),
  startTime: DS.attr('date')
});
