import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

const BACKGROUND_APLHA = 0.4;
const DID_SLIDE_EVENT = 'slid.bs.carousel';

export default Component.extend({
  tagName: 'section',
  attributeBindings: ['dataInterval:data-interval', 'style'],
  classNames: ['card-carousel', 'text-center', 'carousel', 'slide'],
  currentSlide: 0,
  dataInterval: 'false',
  elementId: 'cardCarousel',

  didInsertElement() {
    this._super(...arguments);
    this.$().on(DID_SLIDE_EVENT, event => {
      this.set('currentSlide', event.to);
    });
  },

  willDestoryElement() {
    this.$().off(DID_SLIDE_EVENT);
    this._super(...arguments);
  },

  style: computed('checklistItem.player.country.mauAccent', function() {
    const mauAccent = this.get('checklistItem.player.country.mauAccent');
    if (!mauAccent) { return; }
    const rgba = `rgba(${mauAccent.r}, ${mauAccent.g}, ${mauAccent.b}, ${BACKGROUND_APLHA})`;
    return htmlSafe(`background-color: ${rgba};`);
  })
});
