import Service from '@ember/service';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),

  setup() {
    const store = this.get('store');
    const playersPromise = store.findAll('player').then(players => {
      const nameToId = {};
      players.forEach(player => {
        nameToId[player.get('name')] = player.get('id');
      });
      this.set('nameToId', nameToId);
    });
    return RSVP.all([
      playersPromise,
      store.findAll('checklist-item'),
      store.findAll('country')
    ]);
  }
});
