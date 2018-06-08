import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  strikersContracts: service(),
  web3: service(),

  beforeModel() {
    if (this.get('web3.wrongNetwork')) {
      this.transitionTo('sign-in');
    }
  },

  model(params) {
    const contract = this.get('strikersContracts.StrikersCore.methods');
    const owner = params.user_metadata_id;
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
});
