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
    const contract = this.get('strikersContracts.StrikersPackSale.methods');
    const store = this.get('store');
    const isPaused = contract.paused().call();

    const standardSale = store.queryRecord('pack-sale', 'standard');
    const premiumSale = store.queryRecord('pack-sale', 'premium');

    return RSVP.hash({
      isPaused,
      standardSale,
      premiumSale
    });
  }
});
