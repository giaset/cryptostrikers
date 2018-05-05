import DS from 'ember-data';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default DS.RESTAdapter.extend({
  strikersContracts: service(),

  findAll() {
    const contract = this.get('strikersContracts.Checklist.methods');
    const promises = [];
    for (let i = 0; i < 25; i++) {
      promises.push(contract.setIdToChecklistItems(0, i).call());
    }
    for (let i = 0; i < 20; i++) {
      promises.push(contract.setIdToChecklistItems(1, i).call());
    }
    return RSVP.all(promises).then(checklistItems => {
      checklistItems.forEach((item, index) => {
        const isSeries1 = index > 24;
        const setId = isSeries1 ? 1 : 0;
        const id = isSeries1 ? (index - 25) : index;
        const paddedId = ('0' + id).slice(-2);
        item.id = setId + paddedId;
        item.player = item.playerId;
        item.set = setId;
      });
      return { checklistItems };
    });
  }
});
