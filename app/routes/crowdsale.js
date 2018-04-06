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
    const saleContract = this.get('strikersContracts.StrikersSale.methods');
    const currentRunNumber = saleContract.currentRunNumber().call();
    return RSVP.hash({
      contractState: saleContract.state().call(),
      currentRunNumber: currentRunNumber,
      packPrice: saleContract.packPrice().call(),
      packsMintedForRun: currentRunNumber.then(n => saleContract.packsMintedForRun(n).call()),
      packsMintedLimit: saleContract.PACKS_MINTED_LIMIT().call(),
      packsSoldForRun: currentRunNumber.then(n => saleContract.packsSoldForRun(n).call()),
      totalPacksMinted: saleContract.totalPacksMinted().call()
    });
  }
});
