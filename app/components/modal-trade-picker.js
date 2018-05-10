import ModalComponent from 'ember-modal-service/components/modal';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default ModalComponent.extend({
  classNames: ['modal-trade-picker'],
  store: service(),

  didInsertElement() {
    this._super(...arguments);
    const owner = this.get('model.options.owner');
    this.get('loadUser').perform(owner);
    this.get('loadCards').perform(owner);
  },

  loadCards: task(function * (owner) {
    const cards = yield this.get('store').query('card', { owner });
    this.set('cards', cards);
  }),

  loadUser: task(function * (userId) {
    const user = yield this.get('store').findRecord('user-metadata', userId);
    this.set('user', user);
  })
});
