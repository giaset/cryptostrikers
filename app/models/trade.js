import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  hash: DS.attr('string'),
  tradingContractAddress: DS.attr('string'),
  maker: DS.attr('string'),
  makerCard: DS.belongsTo('card', { inverse: null }),
  taker: DS.attr('string'),
  takerCard: DS.belongsTo('card', { inverse: null }),
  takerChecklistItem: DS.belongsTo('checklistItem', { inverse: null }),
  salt: DS.attr('number'),
  signedHash: DS.attr('string'),

  makerCardString: computed('makerCard.prettyString', function() {
    return this.get('makerCard.prettyString');
  }),

  prettyString: computed('makerCardString', 'takerCardString', function() {
    return `${this.get('makerCardString')} for ${this.get('takerCardString')}`;
  }),

  takerCardOrChecklistId: computed('takerCard.id', 'takerChecklistItem.id', function() {
    return this.get('takerCard.id') || this.get('takerChecklistItem.id');
  }),

  takerCardString: computed('takerCard.prettyString', 'takerChecklistItem.player.name', function() {
    let takerCardString = this.get('takerCard.prettyString');
    if (!takerCardString) {
      const takerPlayerName = this.get('takerChecklistItem.player.name');
      takerCardString = `any ${takerPlayerName}`;
    }
    return takerCardString;
  }),

  takerString: computed('taker', function() {
    const taker = this.get('taker');
    const isZero = taker === '0x0000000000000000000000000000000000000000';
    return isZero ? 'anybody' : taker;
  }),

  url: computed('id', function() {
    return `https://staging.cryptostrikers.com/trades/${this.get('id')}`;
  })
});
