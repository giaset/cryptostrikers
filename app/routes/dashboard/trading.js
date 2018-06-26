import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  strikersContracts: service(),

  model() {
    const contract = this.get('strikersContracts.StrikersCore');
    const tradeCancelledEvents = contract.getPastEvents('TradeCancelled', { fromBlock: 0 });
    const tradeFilledEvents = contract.getPastEvents('TradeFilled', { fromBlock: 0 });

    const uniqueTraders = tradeFilledEvents.then(events => {
      const traders = [];
      events.forEach(event => {
        traders.push(event.returnValues.maker);
        traders.push(event.returnValues.taker);
      });
      return traders.uniq();
    });

    return RSVP.hash({
      tradeCancelledEvents,
      tradeFilledEvents,
      uniqueTraders
    });
  }
});
