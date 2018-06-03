import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import packGenerator from 'cryptostrikers/utils/pack-generator';

export default Route.extend({
  currentUser: service(),
  strikersContracts: service(),

  actions: {
    createNextPremiumSale(featuredChecklistItem, packPrice) {
      if (!featuredChecklistItem || !packPrice) { return; }
      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const from = this.get('currentUser.address');
      contract.createNextPremiumSale(featuredChecklistItem, packPrice).send({ from });
    },

    loadPremiumPacks(featuredChecklistItem) {
      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const from = this.get('currentUser.address');
      const packs = packGenerator(parseInt(featuredChecklistItem));
      contract.addPacksToNextPremiumSale(packs).send({ from });
    },

    startNextPremiumSale() {
      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const from = this.get('currentUser.address');
      contract.startNextPremiumSale().send({ from });
    }
  },

  model() {
    const contract = this.get('strikersContracts.StrikersPackSale.methods');
    const store = this.get('store');

    const currentUserAddress = this.get('currentUser.address');
    const owner = contract.owner().call();
    const nextSale = store.queryRecord('packSale', 'next');

    return RSVP.hash({
      currentUserAddress,
      owner,
      nextSale
    });
  }
});
