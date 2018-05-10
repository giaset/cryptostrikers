import Component from '@ember/component';

export default Component.extend({
  classNames: ['revealable-card', 'clickable'],

  click() {
    this.set('isRevealed', true);
  }
});
