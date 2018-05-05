import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  player: DS.belongsTo(),
  set: DS.belongsTo(),
  totalIssuance: DS.attr('number'),

  filename: computed('id', 'set.id', function() {
    const isGilang = this.get('set.id') === '1';
    const extension = isGilang ? 'jpg' : 'svg';
    return `${this.get('id')}.${extension}`;
  })
});
