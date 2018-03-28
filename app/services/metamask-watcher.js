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
    this.get('web3').getAccounts()
      .then(accounts => {
        this.set('currentAccount', accounts[0]);
        this.set('nextRefresh', later(this, this._tick, this.interval));
      });
  },

  willDestroy() {
    cancel(this.get('nextRefresh'));
    this.set('nextRefresh', null);
  }
});
