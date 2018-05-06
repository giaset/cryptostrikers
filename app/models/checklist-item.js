import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  player: DS.belongsTo(),
  set: DS.belongsTo(),
  totalIssuance: DS.attr('number'),

  filepath: computed('id', 'set.id', function() {
    const path = '/assets/images/cards/';
    const isGilang = this.get('set.id') === '1';
    const extension = isGilang ? 'jpg' : 'svg';
    const filename = `${this.get('id')}.${extension}`;
    return path + filename;
  })
});
