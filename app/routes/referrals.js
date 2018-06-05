import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentUser: service(),
  strikersContracts: service(),

  model() {
    const user = this.get('currentUser.user');
    const contract = this.get('strikersContracts.StrikersPackSale');
    const packsBought = contract.methods.packsBought(user.get('id')).call();
    const referralCode = user.get('referralCode');

    return RSVP.hash({
      packsBought,
      referralCode
    });
  }
});
