import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  strikersContracts: service(),

  model() {
    const contract = this.get('strikersContracts.StrikersChecklist');
    const store = this.get('store');

    const deployStep = contract.methods.deployStep().call();

    const playerCount = contract.methods.playerCount().call();
    const players = contract.getPastEvents('PlayerAdded', { fromBlock: 0, toBlock: 'latest' })
    .then(events => events.map(event => {
      const player = event.returnValues;
      const id = player.id;
      return {
        id,
        name: player.name,
        storePlayer: store.peekRecord('player', id)
      };
    }));

    const originalsCount = contract.methods.originalsCount().call();
    const originals = originalsCount.then(count => {
      const promises = [];
      for (let i = 0; i < count; i++) {
        promises.push(contract.methods.originalChecklistItems(i).call());
      }
      return RSVP.all(promises);
    });

    const iconicsCount = contract.methods.iconicsCount().call();

    const unreleasedCount = contract.methods.unreleasedCount().call();

    /*const promises = [];
    for (let i = 0; i <= 131; i++) {
      promises.push(contract.methods.limitForChecklistId(i).call());
    }
    return RSVP.all(promises)
    .then(limits => limits.map((limit, index) => {
      const id = index.toString().padStart(3, '0');
      return { id, limit };
    }));*/

    /*{{#each model as |checklistItem|}}
  <p>#{{checklistItem.id}} - {{checklistItem.limit}}</p>
{{/each}}*/

    return RSVP.hash({
      deployStep,
      playerCount,
      players,
      originalsCount,
      originals,
      iconicsCount,
      unreleasedCount
    });
  }
});
