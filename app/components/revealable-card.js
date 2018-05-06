import Component from '@ember/component';

export default Component.extend({
  classNames: ['revealable-card'],

  click() {
    this.set('isRevealed', true);
  }
});
