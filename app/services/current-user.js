import Service, { inject as service } from '@ember/service';
import { cancel, later } from '@ember/runloop';

export default Service.extend({
  store: service(),
  web3: service(),
  nextRefresh: null,

  setUser(account) {
    if (account === null) {
      this.set('user', null);
      return;
    }

    const store = this.get('store');
    const address = account.address;
    return this.get('web3').getBalance(address)
    .then(balance => {
      store.pushPayload({
        user: {
          id: address,
          account: account,
          balance: balance
        }
      });
      const user = store.peekRecord('user', address);
      this.set('user', user);
      this._refreshBalance();
      return user;
    });
  },

  _refreshBalance() {
    const user = this.get('user');
    const address = user.get('id');
    this.get('web3').getBalance(address).then(balance => {
      user.set('balance', balance);
      this.set('nextRefresh', later(this, this._refreshBalance, 5000));
    });
  },

  willDestroy() {
    cancel(this.get('nextRefresh'));
    this.set('nextRefresh', null);
  }
});
