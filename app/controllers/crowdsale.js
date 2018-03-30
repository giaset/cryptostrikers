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
      let activityId;
      saleContract.buyPack()
      .then(result => {
        const lastLog = result.logs.get('lastObject');
        const event = {
          name: lastLog.event,
          args: lastLog.args._pack.map(bn => bn.toNumber())
        };

        const activity = this.store.createRecord('activity', {
          event: event,
          txnHash: result.tx,
          type: 'buy_pack',
          user: currentUser
        });
        currentUser.get('activities').addObject(activity);
        return activity.save();
      })
      .then(activity => {
        activityId = activity.get('id');
        //https://github.com/firebase/emberfire/issues/447#issuecomment-264001234
        activity.set('createdAt', firebase.database.ServerValue.TIMESTAMP);
        return activity.save();
      })
      .then(() => {
        currentUser.save();
      })
      .then(() => {
        this.transitionToRoute('activity.show', activityId);
      });
    }
  }
});
