import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['trade-cards'],
  classNameBindings: ['counterpartyAddressError:opacity-30'],
  currentUser: service(),
  modal: service(),

  actions: {
    placeholderClicked(leftSide) {
      if (this.get('counterpartyAddressError')) { return; }
      const owner = leftSide ? this.get('currentUser.address') : this.get('counterpartyAddress');
      const modalOptions = { owner, checklistItem: this.get('makerChecklistItem') };
      this.get('modal').open('trade-picker', modalOptions).then(cardOrChecklistItem => {
        if (leftSide) {
          this.set('selectedCardLeft', cardOrChecklistItem);
        } else {
          const isCard = cardOrChecklistItem.constructor.modelName === 'card';
          const counterpartyCard = isCard ? cardOrChecklistItem : null;
          const counterpartyChecklistItem = isCard ? null : cardOrChecklistItem;
          this.set('counterpartyCard', counterpartyCard);
          this.set('counterpartyChecklistItem', counterpartyChecklistItem);
        }
      })
      .catch(() => {});
    }
  }
});
