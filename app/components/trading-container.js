import Component from '@ember/component';
import DS from 'ember-data';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';

export default Component.extend({
  classNames: ['trading-container', 'mx-auto'],
  currentUser: service(),
  modal: service(),
  store: service(),
  web3: service(),

  actions: {
    placeholderClicked(mySide) {
      if (this.get('counterpartyAddressError')) { return; }
      const owner = mySide ? this.get('currentUser.user.id') : this.get('counterpartyAddress');
      this.get('modal').open('trade-picker', { owner }).then(card => {
        const propName = mySide ? 'myCard' : 'counterpartyCard';
        this.set(propName, card);
      })
      .catch(() => {});
    }
  },

  counterpartyAddressError: computed('counterpartyAddress', function() {
    const address = this.get('counterpartyAddress');
    if (isBlank(address)) { return null; }
    if (!this.get('web3').isAddress(address)) {
      return 'Either leave this empty, or enter a valid Ethereum address.';
    }

    if (address === this.get('currentUser.user.id')) {
      return 'You can\'t trade cards with yourself.';
    }

    return null;
  }),

  counterpartyUser: computed('counterpartyAddress', function() {
    const address = this.get('counterpartyAddress');
    if (isBlank(address)) { return null; }
    if (!this.get('web3').isAddress(address)) { return null; }
    const promise = this.get('store').findRecord('user-metadata', address).catch(() => {
      return { nickname: 'unknown user' };
    });
    return DS.PromiseObject.create({ promise });
  }),

  _resetCounterPartyCard: observer('counterpartyAddress', function() {
    this.set('counterpartyCard', null);
  })
});
