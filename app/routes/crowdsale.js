import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  strikersContracts: service(),

  model() {
    const saleContract = this.get('strikersContracts.saleContract');
    return RSVP.hash({
      ethPriceUSD: saleContract.methods.ethPriceUSD().call(),
      packPriceUSD: saleContract.methods.packPriceUSD().call()
    });
  }
});
