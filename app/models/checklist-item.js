import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  checklistSet: DS.belongsTo('checklist-set', { inverse: null }),
  player: DS.belongsTo(),
  totalIssuance: DS.attr('number'),

  filepath: computed('id', 'checklistSet.id', function() {
    const path = '/assets/images/cards/';
    const isGilang = this.get('id') >= 100;
    const extension = isGilang ? 'png' : 'svg';
    const filename = `${this.get('id')}.${extension}`;
    return path + filename;
  })
});
