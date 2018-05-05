import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  actions: {
    createPlayer(name, country) {
      if (!name || !country) { return; }
      this.get('store').createRecord('player', { name, country }).save();
      this.controller.set('playerName', null);
      this.controller.set('selectedCountry', null);
    }
  },

  model() {
    const store = this.get('store');
    return RSVP.hash({
      countries: store.findAll('country'),
      players: store.findAll('player')
    });
  }
});
