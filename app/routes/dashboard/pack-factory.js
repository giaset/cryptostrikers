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

    generateStandardPacks() {
      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const from = this.get('currentUser.address');
      const packs = packGenerator();
      //debugger;
      contract.addPacksToStandardSale(packs).send({ from });
    },

    loadPremiumPacks(featuredChecklistItem) {
      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const from = this.get('currentUser.address');
      const packs = packGenerator(parseInt(featuredChecklistItem));
      //debugger;
      contract.addPacksToNextPremiumSale(packs).send({ from });
    },

    pause() {
      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const from = this.get('currentUser.address');
      contract.pause().send({ from });
    },

    startNextPremiumSale() {
      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const from = this.get('currentUser.address');
      contract.startNextPremiumSale().send({ from });
    },

    unpause() {
      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const from = this.get('currentUser.address');
      contract.unpause().send({ from });
    }
  },

  model() {
    const contract = this.get('strikersContracts.StrikersPackSale.methods');
    const store = this.get('store');

    const currentUserAddress = this.get('currentUser.address');
    const owner = contract.owner().call();
    const paused = contract.paused().call();
    const currentSale = store.queryRecord('pack-sale', 'premium');
    const nextSale = store.queryRecord('pack-sale', 'next');
    const standardSale = store.queryRecord('pack-sale', 'standard');

    return RSVP.hash({
      currentSale,
      currentUserAddress,
      owner,
      paused,
      nextSale,
      standardSale
    });
  }
});
