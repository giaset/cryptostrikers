import Component from '@ember/component';
import DS from 'ember-data';
import ENV from 'cryptostrikers/config/environment';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';

export default Component.extend({
  classNames: ['trading-container', 'mx-auto'],
  currentUser: service(),
  modal: service(),
  store: service(),
  strikersContracts: service(),
  web3: service(),

  actions: {
    createTrade() {
      const web3 = this.get('web3');
      const tradingContractAddress = ENV.strikers.tradingContractAddress;
      const maker = this.get('currentUser.address');
      const makerCardId = this.get('myCard.id');
      const taker = this.get('counterpartyAddress') || '0x0000000000000000000000000000000000000000';
      const takerCardOrChecklistId = this.get('counterpartyCard.id') || this.get('counterpartyChecklistItem.id');
      const salt = Date.now();

      const address = this.get('currentUser.address');
      const tradeHash = web3.soliditySha3(tradingContractAddress, maker, makerCardId, taker, takerCardOrChecklistId, salt);
      web3.personalSign(tradeHash, address).then(signedHash => {
        const trade = this.get('store').createRecord('trade', {
          tradingContractAddress,
          maker,
          makerCardId,
          taker,
          takerCardOrChecklistId,
          salt,
          signedHash
        });
        return trade.save();
      });
      /*.then(() => {
        debugger
      })
      .catch(error => {
        debugger;
      });*/
    },

    placeholderClicked(mySide) {
      if (this.get('counterpartyAddressError')) { return; }
      const owner = mySide ? this.get('currentUser.user.id') : this.get('counterpartyAddress');
      this.get('modal').open('trade-picker', { owner }).then(cardOrChecklistItem => {
        if (mySide) {
          this.set('myCard', cardOrChecklistItem);
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
  },

  buttonDisabled: computed('myCard.id', 'counterpartyCard.id', 'counterpartyChecklistItem.id', function() {
    const makerCardId = this.get('myCard.id');
    const takerCardOrChecklistId = this.get('counterpartyCard.id') || this.get('counterpartyChecklistItem.id');
    return !makerCardId || !takerCardOrChecklistId;
  }),

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

  _resetCounterpartyCard: observer('counterpartyAddress', function() {
    this.set('counterpartyCard', null);
    this.set('counterpartyChecklistItem', null);
  })
});
