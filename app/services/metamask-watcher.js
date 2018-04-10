import Service, { inject as service } from '@ember/service';
import { cancel, later } from '@ember/runloop';

export default Service.extend({
  web3: service(),
  interval: 1000,
  nextRefresh: null,

  start() {
    this._tick();
  },

  _tick() {
    const web3 = this.get('web3');
    web3.getAccounts()
    .then(accounts => {
      const currentAccount = accounts[0];
      // TODO: detect account change and logout
      this.set('currentAccount', currentAccount);

      if (!currentAccount) {
        throw new Error('MetaMask Locked!');
      }

      return web3.getBalance(currentAccount);
    })
    .then(balance => {
      this.set('currentBalance', balance);
    })
    .catch(() => {})
    .finally(() => {
      this.set('nextRefresh', later(this, this._tick, this.interval));
    });
  },

  willDestroy() {
    cancel(this.get('nextRefresh'));
    this.set('nextRefresh', null);
  }
});
