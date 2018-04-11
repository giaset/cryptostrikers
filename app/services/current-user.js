import Service, { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';

export default Service.extend({
  store: service(),
  session: service(),

  load() {
    const userId = this.get('session.currentUser.uid');
    if (!isEmpty(userId)) {
      return this.get('store').findRecord('user', userId).then(user => {
        this.set('user', user);
        return user;
      });
    } else {
      return RSVP.resolve();
    }
  }
});
