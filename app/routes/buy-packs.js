import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({
  currentUser: service(),
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

    const myAddress = this.get('currentUser.address');
    const globals = store.findRecord('globals', 'globals');
    const hasBurnedKitty = contract.hasBurnedKitty(myAddress).call();
    const isOwedFreeReferralPack = contract.isOwedFreeReferralPack(myAddress).call();
    const standardWhitelistAllocation = contract.whitelists(0, myAddress).call();
    const premiumWhitelistAllocation = contract.whitelists(1, myAddress).call();

    return RSVP.hash({
      globals,
      hasBurnedKitty,
      isOwedFreeReferralPack,
      isPaused,
      standardSale,
      premiumSale,
      standardWhitelistAllocation,
      premiumWhitelistAllocation
    });
  }
});
