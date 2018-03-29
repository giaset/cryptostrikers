import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),

  actions: {
    buyPack() {
      const currentUser = this.get('currentUser.user');
      const saleContract = this.get('strikersContracts.StrikersSale');
      saleContract.buyPack()
      .then(result => {
        const activity = this.store.createRecord('activity', {
          txnHash: result.tx,
          user: currentUser
        });
        currentUser.get('activities').addObject(activity);
        activity.save().then(() => {
          currentUser.save();
        });
      });
    }
  }
});
