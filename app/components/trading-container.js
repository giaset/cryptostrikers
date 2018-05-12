import Component from '@ember/component';
import DS from 'ember-data';
import ENV from 'cryptostrikers/config/environment';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import BigNumber from 'npm:bignumber.js';

const MAX_DIGITS_IN_UNSIGNED_256_INT = 78;

export default Component.extend({
  classNames: ['trading-container', 'mx-auto'],
  currentUser: service(),
  modal: service(),
  store: service(),
  strikersContracts: service(),
  web3: service(),

  actions: {
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

  didInsertElement() {
    this._super(...arguments);
    this.set('salt', this._generatePseudoRandomSalt());
  },

  // https://github.com/0xProject/0x-monorepo/blob/development/packages/order-utils/src/salt.ts
  _generatePseudoRandomSalt() {
    const randomNumber = BigNumber.random(MAX_DIGITS_IN_UNSIGNED_256_INT);
    const factor = new BigNumber(10).pow(MAX_DIGITS_IN_UNSIGNED_256_INT - 1);
    const salt = randomNumber.times(factor).integerValue(BigNumber.ROUND_HALF_CEIL);
    return salt;
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

  _resetCounterpartyCard: observer('counterpartyAddress', function() {
    this.set('counterpartyCard', null);
    this.set('counterpartyChecklistItem', null);
  }),

  tradeHash: computed(
    'currentUser.address',
    'myCard.id',
    'counterpartyAddress',
    'counterpartyCard.id',
    'counterpartyChecklistItem.id',
    'salt',
    function() {
      const tradingContractAddress = ENV.strikers.tradingContractAddress;
      const maker = this.get('currentUser.address');
      const makerCardId = this.get('myCard.id');
      const taker = this.get('counterpartyAddress') || '0x0000000000000000000000000000000000000000';
      const takerCardOrChecklistId = this.get('counterpartyCard.id') || this.get('counterpartyChecklistItem.id');
      const salt = this.get('salt');

      if (!makerCardId || !takerCardOrChecklistId || !salt) { return null; }

      return this.get('web3').soliditySha3(tradingContractAddress, maker, makerCardId, taker, takerCardOrChecklistId, salt);
  }),

  solidityTradeHash: computed(
    'currentUser.address',
    'myCard.id',
    'counterpartyAddress',
    'counterpartyCard.id',
    'counterpartyChecklistItem.id',
    'salt',
    function() {
      const maker = this.get('currentUser.address');
      const makerCardId = this.get('myCard.id');
      const taker = this.get('counterpartyAddress') || '0x0000000000000000000000000000000000000000';
      const takerCardOrChecklistId = this.get('counterpartyCard.id') || this.get('counterpartyChecklistItem.id');
      const salt = this.get('salt');

      if (!makerCardId || !takerCardOrChecklistId || !salt) { return { content: 'Pick cards you fuck' }; }

      const contract = this.get('strikersContracts.StrikersTrading.methods');
      const promise = contract.getTradeHash(maker, makerCardId, taker, takerCardOrChecklistId, salt).call();
      return DS.PromiseObject.create({ promise });
  })
});
