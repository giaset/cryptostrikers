import ModalComponent from 'ember-modal-service/components/modal';

export default ModalComponent.extend({
  classNames: ['strikers-modal-component'],
  actions: {
    clickedInsideModal() {}
  },

  click() {
    this.reject();
  }
});
