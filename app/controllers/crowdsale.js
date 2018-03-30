import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import firebase from 'firebase';

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
          type: 'buy_pack',
          user: currentUser
        });
        currentUser.get('activities').addObject(activity);
        return activity.save();
      })
      .then(activity => {
        //https://github.com/firebase/emberfire/issues/447#issuecomment-264001234
        activity.set('createdAt', firebase.database.ServerValue.TIMESTAMP);
        return activity.save();
      })
      .then(() => {
        currentUser.save();
      });
      /*.then(() => {
        this.transitionToRoute('my-album');
      });*/
    }
  }
});
