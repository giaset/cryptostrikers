import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'cryptostrikers/config/environment';

export default Route.extend({
  currentUser: service(),
  strikersContracts: service(),

  actions: {
    approveClicked(kittyId) {
      const kittiesInterface = this.get('strikersContracts.KittiesInterface.methods');
      const from = this.get('currentUser.address');
      const packSaleAddress = ENV.strikers.saleContractAddress;
      kittiesInterface.approve(packSaleAddress, kittyId).send({ from })
      .on('transactionHash', () => {
        this.transitionTo('kitty-exchange.3', { queryParams: { kittyId }});
      });
    }
  },

  model(params) {
    // TODO: check kittyIndexToApproved
    const kittyId = params.kittyId;
    return this.get('store').findRecord('kitty', kittyId);
  }
});
