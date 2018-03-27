import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  web3: service(),

  actions: {
    buyPack() {
      const myAddress = this.get('currentUser.user.id');
      this.get('web3.saleContract').methods.buyPack().send({from: myAddress})
      .then(receipt => {
        debugger;
      });
    }
  }
});
