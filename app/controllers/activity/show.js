import Controller from '@ember/controller';
import { cancel, later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Controller.extend({
  strikersContracts: service(),
  web3: service(),
  interval: 1000,
  nextRefresh: null,

  startRefreshing() {
    this._tick();
  },

  stopRefreshing() {
    cancel(this.get('nextRefresh'));
    this.set('nextRefresh', null);
  },

  _tick() {
    const hash = this.get('model.txnHash');
    this.get('web3').getTransactionReceipt(hash).then(receipt => {
      if (receipt) {
        const cardIds = this.get('strikersContracts').getCardIdsFromPackBoughtReceipt(receipt);
        this.set('cardIds', cardIds);
      } else {
        this.set('nextRefresh', later(this, this._tick, this.interval));
      }
    });
  }
});
