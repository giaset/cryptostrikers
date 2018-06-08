import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  strikersContracts: service(),

  model(params) {
    const tradeId = params.trade_id;
    const store = this.get('store');

    const trade = store.findRecord('trade', tradeId);

    const contract = this.get('strikersContracts.StrikersCore');
    let cancelEvent;
    let fillEvent;
    if (contract) {
      cancelEvent = trade.then(trade => {
        const filter = { tradeHash: trade.get('hash') };
        return contract.getPastEvents('TradeCancelled', { filter, fromBlock: 0 });
      })
      .then(events => events.get('firstObject'));

      fillEvent = trade.then(trade => {
        const filter = { tradeHash: trade.get('hash') };
        return contract.getPastEvents('TradeFilled', { filter, fromBlock: 0 });
      })
      .then(events => events.get('firstObject'));
    }

    return RSVP.hash({
      cancelEvent,
      fillEvent,
      trade
    });
  }
});
