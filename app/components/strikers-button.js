import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'button',
  classNames: ['btn'],
  attributeBindings: ['type', 'disabled'],
  alwaysDisabled: false,
  loading: false,
  loadingText: 'Loading...',

  disabled: computed('alwaysDisabled', 'loading', function() {
    return this.get('alwaysDisabled') || this.get('loading');
  })
});
