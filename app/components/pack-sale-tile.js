import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['pack-sale-tile', 'my-3', 'p-3', 'bg-white', 'rounded', 'border', 'box-shadow', 'd-flex'],
  selectedQuantity: 1,

  actions: {
    quantitySelected(event) {
      const qty = event.target.value;
      this.set('selectedQuantity', qty);
    }
  },

  buttonText: computed('selectedQuantity', function() {
    const qty = this.get('selectedQuantity');
    return (qty === 1) ? 'Buy 1 Pack' : `Buy ${qty} Packs`;
  })
});
