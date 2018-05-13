import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  tradingContractAddress: DS.attr('string'),
  maker: DS.attr('string'),
  makerCard: DS.belongsTo('card', { inverse: null }),
  taker: DS.attr('string'),
  takerCard: DS.belongsTo('card', { inverse: null }),
  takerChecklistItem: DS.belongsTo('checklistItem', { inverse: null }),
  salt: DS.attr('number'),
  signedHash: DS.attr('string'),

  prettyString: computed('makerCard.prettyString', 'takerCard.prettyString', 'takerChecklistItem.player.name', function() {
    const makerString = this.get('makerCard.prettyString');
    let takerString = this.get('takerCard.prettyString');
    if (!takerString) {
      const takerPlayerName = this.get('takerChecklistItem.player.name');
      takerString = `any ${takerPlayerName}`;
    }
    return `${makerString} for ${takerString}`;
  })
});
