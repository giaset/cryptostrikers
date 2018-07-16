import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  checklistItem: DS.belongsTo(),
  mintTime: DS.attr('date'),
  sale: DS.belongsTo(),
  serialNumber: DS.attr('number'),

  filepath: computed('checklistItem.filepath', function() {
    const filepath = this.get('checklistItem.filepath');
    const starCounts = this.get('store').peekRecord('starCounts', 'starCounts').get('starCounts');
    const starCount = starCounts[this.get('id')] || 0;

    if (starCount > 0) {
      const components = filepath.split('.');
      for (let i = 0; i < starCount; i++) {
        components[0] += '*';
      }
      return components.join('.');
    } else {
      return filepath;
    }
  }),

  prettyString: computed('checklistItem.player.localizedName', 'serialNumberString', function() {
    const playerName = this.get('checklistItem.player.localizedName');
    const serialNumberString = this.get('serialNumberString');
    return `${playerName} (${serialNumberString})`;
  }),

  serialNumberString: computed('checklistItem.tier.limit', 'serialNumber', function() {
    const limit = this.get('checklistItem.tier.limit');
    const serialNumber = this.get('serialNumber');
    return `#${serialNumber}/${limit === 0 ? 'Unlimited' : limit}`;
  })
});
