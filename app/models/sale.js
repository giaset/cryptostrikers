import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default DS.Model.extend({
  web3: service(),

  duration: DS.attr('number'),
  packPrice: DS.attr('number'),
  packsOffered: DS.attr('number'),
  packsSold: DS.attr('number'),
  startTime: DS.attr('date'),
  state: DS.attr('number'),

  completionPercentage: computed('packsSold', 'packsOffered', function() {
    return (this.get('packsSold') / this.get('packsOffered')) * 100;
  }),

  endTime: computed('duration', 'startTime', function() {
    if (!this.get('isFlashSale')) {
      return null;
    }

    const startTime = this.get('startTime').getTime();
    const endTime = startTime + this.get('duration');
    return new Date(endTime);
  }),

  isFlashSale: computed('duration', function() {
    return this.get('duration') > 0;
  }),

  isKittySale: computed('packPrice', function() {
    return this.get('packPrice') === 0;
  }),

  packPriceInEth: computed('packPrice', function() {
    const packPriceInWei = this.get('packPrice').toString();
    const packPriceInEth = this.get('web3').weiToEther(packPriceInWei);
    return `${packPriceInEth} ETH`;
  }),

  stateString: computed('state', function() {
    const state = this.get('state');
    switch (state) {
      case 0:
        return 'Waiting for packs';
      case 1:
        return 'Selling';
      case 2:
        return 'Paused';
    }
  }),

  type: computed('isFlashSale', 'isKittySale', function() {
    if (this.get('isKittySale')) {
      return 'Kitty Sale';
    }

    return this.get('isFlashSale') ? 'Flash Sale' : 'Normal Sale';
  })
});
