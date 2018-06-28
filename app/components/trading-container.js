import Component from '@ember/component';
import ENV from 'cryptostrikers/config/environment';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';

export default Component.extend({
  classNames: ['trading-container', 'container', 'text-center'],
  currentUser: service(),
  intl: service(),
  store: service(),
  strikersContracts: service(),
  web3: service(),

  actions: {
    createTradeClicked() {
      const tradingContractAddress = ENV.strikers.coreContractAddress;
      const maker = this.get('currentUser.address');
      const makerCard = this.get('selectedCardLeft');
      const taker = this.get('counterpartyAddress') || '0x0000000000000000000000000000000000000000';
      const takerCard = this.get('counterpartyCard');
      const takerChecklistItem = this.get('counterpartyChecklistItem');
      const takerCardOrChecklistId = takerCard ? takerCard.get('id') : takerChecklistItem.get('id');
      const salt = Date.now();

      const web3 = this.get('web3');
      const hash = web3.soliditySha3(tradingContractAddress, maker, makerCard.get('id'), taker, takerCardOrChecklistId, salt);

      const trade = {
        hash,
        tradingContractAddress,
        maker,
        makerCard,
        taker,
        takerCard,
        takerChecklistItem,
        salt
      };

      this.createTrade(trade);
    }
  },

  acceptButtonDisabled: computed('makerCard.id', 'selectedCardLeft.id', function() {
    return !this.get('makerCard.id') && !this.get('selectedCardLeft.id');
  }),

  createButtonDisabled: computed('selectedCardLeft.id', 'counterpartyCard.id', 'counterpartyChecklistItem.id', function() {
    const leftCardId = this.get('selectedCardLeft.id');
    const takerCardOrChecklistId = this.get('counterpartyCard.id') || this.get('counterpartyChecklistItem.id');
    return !leftCardId || !takerCardOrChecklistId;
  }),

  counterpartyAddressError: computed('counterpartyAddress', function() {
    const address = this.get('counterpartyAddress');
    if (isBlank(address)) { return null; }
    const intl = this.get('intl');
    if (!this.get('web3').isAddress(address)) {
      return intl.t('trading-container.invalid-address');
    }

    if (address === this.get('currentUser.address')) {
      return intl.t('trading-container.self-trade');
    }

    return null;
  }),

  isMyTrade: computed('currentUser.address', 'trade.maker', function() {
    const maker = this.get('trade.maker');
    return maker && maker === this.get('currentUser.address');
  }),

  makerCard: computed('isMyTrade', 'trade.{makerCard,takerCard}', function() {
    const trade = this.get('trade');
    if (this.get('isMyTrade')) {
      return trade.get('makerCard');
    } else if (trade && trade.get('takerCard')) {
      return trade.get('takerCard');
    }
  }),

  makerChecklistItem: computed('isMyTrade', function() {
    const trade = this.get('trade');
    if (trade && !this.get('isMyTrade')) {
      return trade.get('takerChecklistItem');
    }
  }),

  notOpenToMe: computed('isMyTrade', 'trade', function() {
    const trade = this.get('trade');
    if (!trade || this.get('isMyTrade')) { return false; }
    const taker = this.get('web3').toChecksumAddress(trade.get('taker'));
    if (taker === '0x0000000000000000000000000000000000000000') { return false; }
    const myAddress = this.get('currentUser.address');
    return myAddress !== taker;
  }),

  takerCard: computed('isMyTrade', 'trade.{makerCard,takerCard}', function() {
    const trade = this.get('trade');
    if (this.get('isMyTrade')) {
      return trade.get('takerCard');
    } else if (trade && trade.get('makerCard')) {
      return trade.get('makerCard');
    }
  }),

  takerChecklistItem: computed('isMyTrade', function() {
    if (this.get('isMyTrade')) {
      return this.get('trade.takerChecklistItem');
    }
  }),

  _resetCounterpartyCard: observer('counterpartyAddress', function() {
    this.set('counterpartyCard', null);
    this.set('counterpartyChecklistItem', null);
  })
});
