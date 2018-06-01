import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default DS.Model.extend({
  web3: service(),

  featuredChecklistItem: DS.belongsTo('checklist-item'),
  packPrice: DS.attr('string'),
  packsLoaded: DS.attr('number'),
  packsSold: DS.attr('number'),

  isStandard: computed('id', function() {
    return this.get('id') === '0';
  }),

  packPriceInEth: computed('packPrice', function() {
    return this.get('web3').weiToEther(this.get('packPrice'));
  }),

  packsOffered: computed('isStandard', function() {
    return this.get('isStandard') ? '75,616' : '500';
  }),

  percentComplete: computed('packsSold', 'packsOffered', function() {
    const packsOffered = parseInt(this.get('packsOffered').replace(/,/g, ''));
    return (this.get('packsSold') / packsOffered) * 100;
  })
});
