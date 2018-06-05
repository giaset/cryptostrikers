import Component from '@ember/component';

export default Component.extend({
  classNames: ['flippable-card-scene', 'clickable'],

  click() {
    this.toggleProperty('isFlipped');
  }
});
