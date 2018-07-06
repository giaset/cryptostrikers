import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['clickable-card-placeholder'],
  modal: service(),

  actions: {
    placeholderClicked(acceptedPlayers, myCards) {
      this.get('modal').open('play-picker', { acceptedPlayers, myCards }).then(card => {
        this.set('card', card);
      }).catch(() => {});
    }
  }
});
