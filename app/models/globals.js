import DS from 'ember-data';

export default DS.Model.extend({
  checklistItemOfTheDay: DS.belongsTo('checklist-item', { inverse: null })
});
