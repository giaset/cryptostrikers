import DS from 'ember-data';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default DS.Adapter.extend({
  strikersContracts: service(),

  findAll() {
    const contract = this.get('strikersContracts.StrikersUpdate.methods');
    const promises = [];
    for (let i = 0; i < 4; i++) {
      promises.push(contract.getGame(i).call());
    }
    return RSVP.all(promises).then(games => {
      games.forEach((game, index) => {
        game.id = index;
        game.startTime *= 1000;
      });
      return games;
    });
  }
});
