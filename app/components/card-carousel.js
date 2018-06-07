import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

const BACKGROUND_APLHA = 0.4;
const DID_SLIDE_EVENT = 'slide.bs.carousel';

export default Component.extend({
  tagName: 'section',
  attributeBindings: ['dataInterval:data-interval', 'style'],
  classNames: ['card-carousel', 'text-center', 'carousel', 'slide'],
  dataInterval: 'false',
  elementId: 'cardCarousel',

  didInsertElement() {
    this._super(...arguments);
    this.$().on(DID_SLIDE_EVENT, event => {
      if (this.slideDidChange) {
        this.slideDidChange(event.to);
      }
    });
  },

  willDestoryElement() {
    this.$().off(DID_SLIDE_EVENT);
    this._super(...arguments);
  },

  accentColor: computed('checklistItem.checklistSet.id', 'country.{gilangAccent,mauAccent}', function() {
    const country = this.get('country');
    const setId = this.get('checklistItem.checklistSet.id');
    return setId === '0' ? country.get('mauAccent') : country.get('gilangAccent');
  }),

  country: computed('checklistItem.player.country', function() {
    return this.get('checklistItem.player.country');
  }),

  style: computed('accentColor', function() {
    const accentColor = this.get('accentColor');
    if (!accentColor) { return; }
    const rgba = `rgba(${accentColor.r}, ${accentColor.g}, ${accentColor.b}, ${BACKGROUND_APLHA})`;
    return htmlSafe(`background-color: ${rgba};`);
  })
});
