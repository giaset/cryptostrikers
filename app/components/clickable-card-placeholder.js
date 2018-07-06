import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  classNames: ['clickable-card-placeholder'],
  modal: service(),

  actions: {
    placeholderClicked(acceptedPlayers, myCards) {
      this.get('modal').open('play-picker', { acceptedPlayers, myCards }).then(card => {
        this.set('selectedCard', card);
      }).catch(() => {});
    }
  },

  card: computed('selectedCard', 'submittedCard', function() {
    return this.get('selectedCard') || this.get('submittedCard');
  }),

  matchStarted: computed('currentTime', 'game.startTime', function() {
    const currentTime = this.get('currentTime');
    const startTime = this.get('game.startTime').getTime() / 1000;
    return currentTime >= startTime;
  }),

  submittedCard: computed('game.id', 'myPicks', function() {
    const index = this.get('game.id');
    const pick = this.get('myPicks').objectAt(index);

    if (pick.get('id') !== '0') {
      return pick;
    }
  }),

  updateCurrentTime: task(function * () {
    const currentTime = Math.round(new Date() / 1000);
    this.set('currentTime', currentTime);
    yield timeout(1000);
    this.get('updateCurrentTime').perform();
  }).on('didInsertElement')
});
