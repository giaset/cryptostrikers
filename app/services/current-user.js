import Service, { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),
  web3: service(),

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
      return user;
      // start balance refresh timer
    });
  }
});
