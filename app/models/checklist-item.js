import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  checklistSet: DS.belongsTo('checklist-set', { inverse: null }),
  player: DS.belongsTo('player', { inverse: null }),
  tier: DS.belongsTo('rarity-tier', { inverse: null }),

  filepath: computed('id', 'checklistSet.id', function() {
    const path = '/assets/images/cards/';
    const isGilang = this.get('id') >= 100;
    const extension = isGilang ? 'png' : 'svg';
    const filename = `${this.get('id')}.${extension}`;
    return path + filename;
  }),

  tierImage: computed('tier.id', function() {
    const tierId = this.get('tier.id');
    let filename = 'iconic';

    if (tierId === '2') {
      filename = 'diamond-small';
    } else if (tierId === '3') {
      filename = 'gold-small';
    } else if (tierId === '4') {
      filename = 'silver-small';
    } else if (tierId === '5') {
      filename = 'bronze-small';
    }

    return `/assets/images/${filename}.svg`;
  })
});
