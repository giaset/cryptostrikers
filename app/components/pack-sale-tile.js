import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Component.extend({
  classNames: ['pack-sale-tile', 'my-3', 'p-3', 'rounded', 'border', 'box-shadow', 'd-flex'],
  modal: service(),
  selectedQuantity: 1,

  actions: {
    kittiesButtonClicked() {
      this.get('modal').open('kitty', { saleId: this.get('sale.id') });
    },

    quantitySelected(event) {
      const qty = event.target.value;
      this.set('selectedQuantity', qty);
    }
  },

  buttonText: computed('selectedQuantity', function() {
    const qty = this.get('selectedQuantity');
    return (qty === 1) ? 'Buy 1 Pack' : `Buy ${qty} Packs`;
  }),

  countdownString: computed('clock.second', 'sale.endTime', function() {
    const now = new Date().getTime();
    const endTime = this.get('sale.endTime').getTime();
    const diff = endTime - now;

    if (diff < 0) {
      return '00:00:00';
    }

    const duration = moment.duration(diff);
    const hours = this._padLeft(duration.hours());
    const minutes = this._padLeft(duration.minutes());
    const seconds = this._padLeft(duration.seconds());
    return `${hours}:${minutes}:${seconds}`;
  }),

  _padLeft(value) {
    // '0' + '12' = '012', '012'.slice(-2) = '12'
    // '0' + '1' = '01', '01'.slice(-2) = '01'
    return ('0' + value).slice(-2);
  }/*,

  // TODO: maybe need to watch the pack bought event and update this in real time?
  isActive: computed('clock.second', 'sale.{endTime,packsOffered,packsSold,state}', function() {
    if (!this.get('state') === 1) {
      return false;
    }

  })*/
});
