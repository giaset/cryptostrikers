import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNames: ['pack-sale-column', 'text-center'],

  isStandard: computed('sale.id', function() {
    return this.get('sale.id') === '0';
  }),

  progressBarStyle: computed('sale.percentComplete', function() {
    return htmlSafe(`width: ${this.get('sale.percentComplete')}%;`);
  })
});
