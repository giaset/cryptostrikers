import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({
  strikersContracts: service(),
  web3: service(),

  beforeModel() {
    if (this.get('web3.wrongNetwork')) {
      this.transitionTo('sign-in');
    }
  },

  model() {
    const saleContract = this.get('strikersContracts.StrikersPackSale.methods');
    return RSVP.hash({
      packPrice: saleContract.packPrice().call(),
      sales: this.get('store').findAll('sale')
    });
  }
});
