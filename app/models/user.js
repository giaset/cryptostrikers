import DS from 'ember-data';

export default DS.Model.extend({
  activities: DS.hasMany('activity', { inverse: null }),
  email: DS.attr('string'),
  metadata: DS.belongsTo('user-metadata', { inverse: null }),
  referralCode: DS.belongsTo('referral-code', { inverse: null })
});
