import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  checklistItem: DS.belongsTo(),
  mintTime: DS.attr('date'),
  sale: DS.belongsTo(),
  serialNumber: DS.attr('number'),

  prettyString: computed('checklistItem.player.name', 'serialNumberString', function() {
    const playerName = this.get('checklistItem.player.name');
    const serialNumberString = this.get('serialNumberString');
    return `${playerName} (${serialNumberString})`;
  }),

  serialNumberString: computed('checklistItem.tier.limit', 'serialNumber', function() {
    const limit = this.get('checklistItem.tier.limit');
    const serialNumber = this.get('serialNumber');
    return `#${serialNumber}/${limit === 0 ? 'Unlimited' : limit}`;
  })
});
