import Component from '@ember/component';

export default Component.extend({
  attributeBindings: ['tabindex', 'role', 'ariaLabelledBy:aria-labelledby', 'ariaHidden:aria-hidden'],
  classNames: ['strikers-modal', 'modal', 'fade'],

  tabindex: '-1',
  role: 'dialog',
  ariaLabelledBy: 'strikersModalLabel',
  ariaHidden: 'true',

  actions: {
    confirmButtonClicked() {
      this.$().modal('hide');
      const confirmAction = this.get('confirmAction');
      if (confirmAction) {
        confirmAction();
      }
    }
  }
});
