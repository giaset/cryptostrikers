import Service, { inject as service } from '@ember/service';
import { cancel, later } from '@ember/runloop';

const ACCOUNT_MISMATCH_ERROR = 'Account mismatch';

export default Service.extend({
  session: service(),
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
      this.set('currentAccount', currentAccount);

      if (!currentAccount) {
        throw new Error('MetaMask Locked!');
      }

      const userAccount = this.get('session.currentUser.uid');
      if (userAccount && userAccount != currentAccount) {
        throw new Error(ACCOUNT_MISMATCH_ERROR);
      }

      return web3.getBalance(currentAccount);
    })
    .then(balance => {
      this.set('currentBalance', balance);
    })
    .catch(error => {
      if (error.message === ACCOUNT_MISMATCH_ERROR) {
        return this.get('session').close().then(() => {
          window.location.replace('/');
        });
      }
    })
    .finally(() => {
      this.set('nextRefresh', later(this, this._tick, this.interval));
    });
  },

  willDestroy() {
    cancel(this.get('nextRefresh'));
    this.set('nextRefresh', null);
  }
});
