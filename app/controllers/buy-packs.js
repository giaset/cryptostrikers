import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),

  actions: {
    buyPack(sale) {
      if (!sale) { return; }
      const currentUser = this.get('currentUser');
      const saleContract = this.get('strikersContracts.StrikersPackSale.methods');
      const premium = !sale.get('isStandard');
      saleContract.buyPackWithETH(premium).send({
        from: currentUser.get('address'),
        /*gas: 750000,*/
        value: sale.get('packPrice')
      })
      .on('transactionHash', txnHash => {
        const type = 'buy_pack';
        const activity = { premium, txnHash, type };
        currentUser.addActivity(activity).then(activityId => {
          this.transitionToRoute('activity.show', activityId);
        });
      })
      .on('error', () => {
        // TODO: handle error
      });
    }
  }
});
