import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import firebase from 'firebase';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),

  actions: {
    buyPack() {
      const currentUser = this.get('currentUser.user');
      const saleContract = this.get('strikersContracts.StrikersSale.methods');
      saleContract.buyPack().send({from: currentUser.get('id')})
      .on('transactionHash', hash => {
        this._handleTransactionHash(hash, currentUser);
      })
      .on('error', () => {
        // TO-DO: handle error
      });
    }
  },

  _handleTransactionHash(hash, currentUser) {
    const activity = this.store.createRecord('activity', {
      txnHash: hash,
      type: 'buy_pack',
      user: currentUser
    });
    currentUser.get('activities').addObject(activity);
    let activityId;
    activity.save().then(activity => {
      activityId = activity.get('id');
      // https://github.com/firebase/emberfire/issues/447#issuecomment-264001234
      activity.set('createdAt', firebase.database.ServerValue.TIMESTAMP);
      return activity.save();
    })
    .then(() => currentUser.save())
    .then(() => {
      this.transitionToRoute('activity.show', activityId);
    });
  }
});
