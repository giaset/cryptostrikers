import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  web3: service(),

  actions: {
    buyPack() {
      const web3 = this.get('web3');
      web3._instance.eth.getAccounts()
      .then(accounts => {
        const account = accounts[0];
        return web3.get('saleContract').methods.buyPack().send({from: account});
      })
      .then(receipt => {
        return receipt.transactionHash;
      });
    }
  }
});
