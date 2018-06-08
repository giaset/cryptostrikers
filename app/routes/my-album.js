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
      checklistItems: store.findAll('checklist-item'),
      checklistSets: store.findAll('checklist-set', { reload: true }).then(checklistSets => checklistSets.sortBy('id')),
      myChecklistIds: contract.cardAndChecklistIdsForOwner(owner).call().then(arrays => {
        const checklistIds = arrays[1];
        return checklistIds.map(checklistId => checklistId.padStart(3, '0'));
      })
    });
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('selectedFilter', null);
    }
  }
});
