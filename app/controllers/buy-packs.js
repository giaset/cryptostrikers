import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),

  actions: {
    buyPack(sale) {
      if (!sale) { return; }
      this.get('buyPackTask').perform(sale);
    },

    claimWhitelistPack(premium) {
      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const currentUser = this.get('currentUser');
      const from = currentUser.get('address');
      contract.claimWhitelistPack(premium).send({ from })
      .on('transactionHash', txnHash => {
        const type = 'claim_whitelist_pack';
        const activity = { premium, txnHash, type };
        currentUser.addActivity(activity).then(activityId => {
          this.transitionToRoute('activity.show', activityId);
        });
      });
    }
  },

  buyPackTask: task(function * (sale) {
    const contract = this.get('strikersContracts.StrikersPackSale.methods');
    const currentUser = this.get('currentUser');
    const from = currentUser.get('address');
    const premium = !sale.get('isStandard');
    const referrer = currentUser.get('user.referrer.id');
    const value = sale.get('packPrice');

    let shouldAttributeReferral = false;
    if (referrer) {
      const packsBought = yield contract.packsBought(from).call();
      shouldAttributeReferral = parseInt(packsBought) === 0;
    }

    const contractFunction = shouldAttributeReferral ? contract.buyFirstPackFromReferral(referrer, premium) : contract.buyPackWithETH(premium);
    contractFunction.send({ from, value })
    .on('transactionHash', txnHash => {
      const type = 'buy_pack';
      const activity = { premium, txnHash, type };
      currentUser.addActivity(activity).then(activityId => {
        this.transitionToRoute('activity.show', activityId);
      });
    });
  }).drop()
});
