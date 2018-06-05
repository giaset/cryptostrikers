import DS from 'ember-data';

export default DS.Model.extend({
  userMetadata: DS.belongsTo('user-metadata', { inverse: null })
});
