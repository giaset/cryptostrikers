import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({
  strikersContracts: service(),
  web3: service(),

  beforeModel() {
    if (this.get('web3.wrongNetwork')) {
      this.transitionTo('sign-in');
    }
  },

  model(params) {
    const store = this.get('store');
    const randomVideo = store.findAll('video').then(videos => {
      const index = Math.floor(Math.random() * videos.get('length'));
      return videos.objectAt(index);
    });
    return RSVP.hash({
      activity: store.findRecord('activity', params.activity_id),
      video: randomVideo
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.get('getCardsFromTransaction').perform();
  }
});
