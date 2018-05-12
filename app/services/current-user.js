import Service, { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';

export default Service.extend({
  metrics: service(),
  store: service(),
  session: service(),

  address: alias('user.id'),

  load() {
    const userId = this.get('session.currentUser.uid');
    if (!isEmpty(userId)) {
      return this.get('store').findRecord('user', userId).then(user => {
        this.setUser(user);
        return user;
      });
    } else {
      return RSVP.resolve();
    }
  },

  setUser(user) {
    this.set('user', user);
    this.set('metrics.context.userAddress', user.get('id'));
  }
});
