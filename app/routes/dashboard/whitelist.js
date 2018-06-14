import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentUser: service(),
  strikersContracts: service(),

  actions: {
    addAddress(premium, address) {
      if (!address) { return; }
      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const from = this.get('currentUser.address');
      contract.addToWhitelistAllocation(premium, address, 1).send({ from });
    },

    addBulkPremiumAddresses(addresses) {
      const addressesArray = addresses.split('\n');
      //debugger;
      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const from = this.get('currentUser.address');
      contract.addAddressesToWhitelist(true, addressesArray).send({ from });
    },

    addBulkStandardAddresses(addresses) {
      const addressesArray = addresses.split('\n');
      //debugger;
      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const from = this.get('currentUser.address');
      contract.addAddressesToWhitelist(false, addressesArray).send({ from });
    }
  },

  model() {
    const contract = this.get('strikersContracts.StrikersPackSale.methods');
    const standardWhitelistCount = contract.currentWhitelistCounts(0).call();
    const premiumWhitelistCount = contract.currentWhitelistCounts(1).call();
    return RSVP.hash({
      standardWhitelistCount,
      premiumWhitelistCount
    });
  }
});
