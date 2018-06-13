import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentUser: service(),
  strikersContracts: service(),

  actions: {
    transferKittyClicked(kittyId) {
      const currentUser = this.get('currentUser');
      const from = currentUser.get('address');
      const packSaleContract = this.get('strikersContracts.StrikersPackSale.methods');
      packSaleContract.buyPackWithKitty(kittyId).send({ from })
      .on('transactionHash', txnHash => {
        const type = 'buy_pack_with_kitty';
        const activity = { kittyId, txnHash, type };
        currentUser.addActivity(activity).then(activityId => {
          this.transitionTo('activity.show', activityId);
        });
      });
    }
  },

  model(params) {
    const kittyId = params.kittyId;
    return this.get('store').findRecord('kitty', kittyId);
  }
});
