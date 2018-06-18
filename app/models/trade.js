import DS from 'ember-data';
import ENV from 'cryptostrikers/config/environment';
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

  isOpenTrade: computed('taker', function() {
    const taker = this.get('taker');
    return taker === '0x0000000000000000000000000000000000000000';
  }),

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

  url: computed('id', function() {
    return `${ENV.strikers.baseUrl}trades/${this.get('id')}`;
  })
});
