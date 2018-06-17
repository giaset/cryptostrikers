import ModalComponent from 'ember-modal-service/components/modal';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default ModalComponent.extend({
  classNames: ['modal-trade-picker'],
  store: service(),
  web3: service(),

  didInsertElement() {
    this._super(...arguments);
    const options = this.get('model.options');
    const owner = options.owner;
    const checklistItem = options.checklistItem;
    if (owner) {
      this.get('loadUser').perform(owner);
      this.get('loadCards').perform(owner, checklistItem);
    } else {
      this.get('loadChecklistItems').perform();
    }
  },

  loadCards: task(function * (owner, checklistItem) {
    let cards = yield this.get('store').query('card', { owner });

    if (checklistItem) {
      cards = cards.filterBy('checklistItem.id', checklistItem.get('id'));
    }

    this.set('cards', cards);
  }),

  loadChecklistItems: task(function * () {
    const checklistItems = yield this.get('store').findAll('checklist-item');
    this.set('checklistItems', checklistItems);
  }),

  loadUser: task(function * (userId) {
    const checksummedAddress = this.get('web3').toChecksumAddress(userId);
    const user = yield this.get('store').findRecord('user-metadata', checksummedAddress);
    this.set('user', user);
  })
});
