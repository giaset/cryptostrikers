import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  strikersContracts: service(),

  model() {
    const contract = this.get('strikersContracts.StrikersChecklist');
    const promises = [];
    for (let i = 0; i <= 131; i++) {
      promises.push(contract.methods.limitForChecklistId(i).call());
    }
    return RSVP.all(promises)
    .then(limits => limits.map((limit, index) => {
      const id = index.toString().padStart(3, '0');
      return { id, limit };
    }));


    /*const players = contract.getPastEvents('PlayerAdded', { fromBlock: 0, toBlock: 'latest' })
    .then(events => events.mapBy('returnValues'));

    const originals = contract.methods.originalsCount().call()
    .then(count => {
      const promises = [];
      for (let i = 0; i < count; i++) {
        promises.push(contract.methods.originalChecklistItems(i).call());
      }
      return RSVP.all(promises);
    })
    .then(originals => {
      debugger;
    });

    return RSVP.hash({
      originals,
      players
    });*/
  }
});
