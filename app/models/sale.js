import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default DS.Model.extend({
  web3: service(),

  duration: DS.attr('number'),
  packPrice: DS.attr('string'),
  packsOffered: DS.attr('number'),
  packsSold: DS.attr('number'),
  startTime: DS.attr('date'),
  state: DS.attr('number'),

  completionPercentage: computed('packsSold', 'packsOffered', function() {
    return (this.get('packsSold') / this.get('packsOffered')) * 100;
  }),

  isFlashSale: computed('duration', function() {
    return this.get('duration') > 0;
  }),

  packPriceInEth: computed('packPrice', function() {
    return this.get('web3').weiToEther(this.get('packPrice'));
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
  })
});
