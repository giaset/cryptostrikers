import Component from '@ember/component';

export default Component.extend({
  classNames: ['flippable-card-scene'],
  classNameBindings: ['flippable:clickable'],

  click() {
    if (this.get('flippable')) {
      this.toggleProperty('isFlipped');
    }
  }
});
