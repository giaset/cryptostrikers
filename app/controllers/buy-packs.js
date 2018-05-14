import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),
  web3: service(),

  actions: {
    buyPackButtonClicked(saleId) {
      this.set('selectedSale', saleId);
    },

    buyPack(gasPrice) {
      const currentUser = this.get('currentUser');
      const saleContract = this.get('strikersContracts.StrikersPackSale.methods');
      const gasPriceInWei = this.get('web3').toWei(gasPrice.toString(), 'Gwei');
      const saleId = this.get('selectedSale');
      const packPrice = this.get('store').peekRecord('sale', saleId).get('packPrice');
      saleContract.buyPackWithETH(saleId).send({
        from: currentUser.get('address'),
        /*gas: 750000,*/
        gasPrice: gasPriceInWei,
        value: packPrice
      })
      .on('transactionHash', txnHash => {
        const type = 'buy_pack';
        const activity = { saleId, txnHash, type };
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
