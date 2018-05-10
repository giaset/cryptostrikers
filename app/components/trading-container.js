import Component from '@ember/component';
import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';

export default Component.extend({
  classNames: ['trading-container', 'mx-auto'],
  currentUser: service(),
  modal: service(),
  store: service(),
  web3: service(),

  actions: {
    leftPlaceholderClicked() {
      if (this.get('invalidCounterpartyAddress')) { return; }
      const myAddress = this.get('currentUser.user.id');
      this.get('modal').open('trade-picker', { owner: myAddress }).then(card => {
        this.set('myCard', card);
      })
      .catch(() => {});
    },

    rightPlaceholderClicked() {
      if (this.get('invalidCounterpartyAddress')) { return; }
      const counterpartyAddress = this.get('counterpartyAddress');
      this.get('modal').open('trade-picker', { owner: counterpartyAddress }).then(card => {
        this.set('counterpartyCard', card);
      })
      .catch(() => {});
    },
  },

  counterpartyUser: computed('counterpartyAddress', function() {
    const address = this.get('counterpartyAddress');
    if (isBlank(address)) { return null; }
    if (!this.get('web3').isAddress(address)) { return null; }
    const promise = this.get('store').findRecord('user-metadata', address).catch(() => {
      return { nickname: 'unknown user' };
    });
    return DS.PromiseObject.create({ promise });
  }),

  invalidCounterpartyAddress: computed('counterpartyAddress', function() {
    const address = this.get('counterpartyAddress');
    if (isBlank(address)) { return false; }
    return !this.get('web3').isAddress(address);
  })
});
