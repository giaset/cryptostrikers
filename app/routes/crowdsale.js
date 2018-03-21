import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  web3: service(),

  model() {
    const saleContract = this.get('web3').saleContract();
    const ethPriceUSD = saleContract.then(contract => contract.methods.ethPriceUSD().call());
    const packPriceUSD = saleContract.then(contract => contract.methods.packPriceUSD().call());
    return RSVP.hash({
      ethPriceUSD: ethPriceUSD,
      packPriceUSD: packPriceUSD
    });
  }
});
