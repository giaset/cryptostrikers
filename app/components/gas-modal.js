import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  ajax: service(),

  attributeBindings: ['tabindex', 'role', 'ariaLabelledBy:aria-labelledby', 'ariaHidden:aria-hidden'],
  classNames: ['gas-modal', 'strikers-modal', 'modal', 'fade'],

  tabindex: '-1',
  role: 'dialog',
  ariaLabelledBy: 'gasModalLabel',
  ariaHidden: 'true',

  actions: {
    confirmButtonClicked(gasPrice) {
      this.$().modal('hide');
      const confirmAction = this.get('confirmAction');
      if (confirmAction) {
        confirmAction(gasPrice);
      }
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this._updateGasOptions();
    this.$().on('show.bs.modal', () => {
      this._updateGasOptions();
    });
  },

  _updateGasOptions() {
    const gasStationApi = 'https://ethgasstation.info/json/ethgasAPI.json';
    this.get('ajax').request(gasStationApi).then(response => {
      const gasOptions = [
        {
          name: 'Slow',
          gasPrice: response.safeLow/10
        },
        {
          name: 'Average',
          gasPrice: response.average/10
        },
        {
          name: 'Fast',
          gasPrice: response.fast/10
        }
      ];
      this.set('gasOptions', gasOptions);
    });
  }
});
