import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  strikersContracts: service(),

  model() {
    const contract = this.get('strikersContracts.StrikersPackSale');
    const filter = { runNumber: 1 };
    return contract.getPastEvents('PacksLoaded', { filter, fromBlock: 0, toBlock: 'latest' }).then(events => {
      const playerToCount = {};
      events.forEach(event => {
        event.returnValues.packs.forEach(pack => {
          const players = this._packToPlayers(parseInt(pack));
          players.forEach(player => {
            if (playerToCount[player]) {
              playerToCount[player]++;
            } else {
              playerToCount[player] = 1;
            }
          });
        });
      });

      return playerToCount;
    });
  },

  _packToPlayers(pack) {
    const player1 = pack >> 24;
    const player2 = (pack >> 16) & 255;
    const player3 = (pack >> 8) & 255;
    const player4 = pack & 255;

    return [player1, player2, player3, player4];
  }
});
