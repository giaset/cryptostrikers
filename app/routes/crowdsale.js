import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({
  strikersContracts: service(),

  model() {
    const saleContract = this.get('strikersContracts.StrikersSale');
    return RSVP.hash({
      ethPriceUSD: saleContract.ethPriceUSD(),
      packPriceUSD: saleContract.packPriceUSD()
    });
  }
});
