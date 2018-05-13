import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  checklistItem: DS.belongsTo(),
  mintTime: DS.attr('date'),
  sale: DS.belongsTo(),
  serialNumber: DS.attr('number'),

  prettyString: computed('checklistItem.{player.name,totalIssuance}', 'serialNumber', function() {
    const checklistItem = this.get('checklistItem');
    const playerName = checklistItem.get('player.name');
    const serialNumber = this.get('serialNumber');
    const totalIssuance = checklistItem.get('totalIssuance');
    return `${playerName} (#${serialNumber}/${totalIssuance})`;
  })
});
