import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  classNameBindings: ['countdownOver:opacity-30'],
  classNames: ['pack-sale-tile', 'my-3', 'p-3', 'rounded', 'border', 'box-shadow', 'd-flex'],
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
  }),

  countdownDiff: computed('clock.second', 'sale.endTime', function() {
    const endTime = this.get('sale.endTime');
    if (!endTime) { return; }
    const now = new Date().getTime();
    return endTime.getTime() - now;
  }),

  countdownString: computed('countdownDiff', function() {
    const diff = this.get('countdownDiff');
    return this._countdownStringForDiff(diff);
  }),

  // TODO: maybe need to watch the pack bought event and update this in real time?
  // 'sale.{endTime,packsOffered,packsSold,state}'
  // state === 1, return false
  countdownOver: computed('countdownDiff', function() {
    const diff = this.get('countdownDiff');
    if (!diff) { return false; }
    return diff <= 0;
  }),

  _countdownStringForDiff(diff) {
    if (diff < 0) {
      return '00:00:00';
    }

    const duration = moment.duration(diff);
    const hours = this._padLeft(duration.hours());
    const minutes = this._padLeft(duration.minutes());
    const seconds = this._padLeft(duration.seconds());
    return `${hours}:${minutes}:${seconds}`;
  },

  _padLeft(value) {
    // '0' + '12' = '012', '012'.slice(-2) = '12'
    // '0' + '1' = '01', '01'.slice(-2) = '01'
    return ('0' + value).slice(-2);
  }
});
