import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),

  actions: {
    buyPack() {
      const currentUser = this.get('currentUser.user');
      const saleContract = this.get('strikersContracts.saleContract.methods');
      saleContract.buyPack().send({from: currentUser.get('id')})
      .then(receipt => {
        const activity = this.store.createRecord('activity', {
          txnHash: receipt.transactionHash,
          user: currentUser
        });
        activity.save();
      });
    }
  }
});
