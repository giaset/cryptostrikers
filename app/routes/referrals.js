import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentUser: service(),
  strikersContracts: service(),

  model() {
    const address = this.get('currentUser.address');
    const contract = this.get('strikersContracts.StrikersPackSale');
    const packsBought = contract.methods.packsBought(address).call();

    return RSVP.hash({
      packsBought
    });
  }
});
