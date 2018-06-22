import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  strikersContracts: service(),

  model() {
    const contract = this.get('strikersContracts.StrikersPackSale');

    const packBoughtEvents = contract.getPastEvents('PackBought', { fromBlock: 0 });

    const kittyBurnedEvents = contract.getPastEvents('KittyBurned', { fromBlock: 0 });
    const totalKittiesBurned = contract.methods.totalKittiesBurned().call();

    const whitelistEvents = contract.getPastEvents('WhitelistAllocationUsed', { fromBlock: 0 });

    return RSVP.hash({
      packBoughtEvents,
      kittyBurnedEvents,
      totalKittiesBurned,
      whitelistEvents
    });
  }
});
