import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

const BONUS_CHECKLIST_IDS = [
  115, 127, 122, 130,
  116, 123, 121, 131
];

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
    const contract = this.get('strikersContracts.StrikersPackSale');
    const store = this.get('store');
    const user = this.get('currentUser.user');

    const bonusChecklistItems = BONUS_CHECKLIST_IDS.map(checklistId => store.findRecord('checklist-item', checklistId));
    const packsBought = contract.methods.packsBought(user.get('id')).call();
    const referralCode = user.get('referralCode');

    return RSVP.hash({
      bonusChecklistItems: RSVP.all(bonusChecklistItems),
      packsBought,
      referralCode
    });
  }
});
