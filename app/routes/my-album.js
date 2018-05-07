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
    const contract = this.get('strikersContracts.StrikersCore.methods');
    const owner = this.get('currentUser.user.id');
    const store = this.get('store');

    return RSVP.hash({
      checklistItems: store.findAll('checklistItem'),
      myChecklistIds: contract.checklistIdsForOwner(owner).call().then(checklistIds => {
        return checklistIds.map(checklistId => checklistId.padStart(3, '0'));
      }),
      sets: store.findAll('set')
    });
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('selectedFilter', null);
    }
  }
});
