import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default DS.Model.extend({
  intl: service(),

  bio: DS.attr('string'),
  chineseName: DS.attr('string'),
  country: DS.belongsTo('country', { inverse: null }),
  name: DS.attr('string'),
  wcInfo: DS.attr('string'),
  wiki: DS.attr('string'),

  localizedName: computed('intl.locale', 'chineseName', 'name', function() {
    const locale = this.get('intl.locale')[0];
    if (locale === 'zh-hans-cn') {
      return this.get('chineseName');
    }

    return this.get('name');
  })
});
