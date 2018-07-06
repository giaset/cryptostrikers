import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  strikersContracts: service(),

  model() {
    const contract = this.get('strikersContracts.StrikersUpdate');
    const pickMadeEvents = contract.getPastEvents('PickMade', { fromBlock: 0 });
    return pickMadeEvents;
  }
});
