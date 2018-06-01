import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['pack-sale-column', 'text-center'],

  isStandard: computed('sale.id', function() {
    return this.get('sale.id') === '0';
  })
});
