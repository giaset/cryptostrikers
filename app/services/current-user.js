import Service, { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import firebase from 'firebase';
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
  },

  addActivity(payload) {
    const user = this.get('user');
    payload.user = user;
    const newActivity = this.get('store').createRecord('activity', payload);
    user.get('activities').addObject(newActivity);
    let activityId;
    return newActivity.save().then(activity => {
      activityId = activity.get('id');
      // https://github.com/firebase/emberfire/issues/447#issuecomment-264001234
      activity.set('createdAt', firebase.database.ServerValue.TIMESTAMP);
      return activity.save();
    })
    .then(() => user.save())
    .then(() => RSVP.resolve(activityId));
  }
});
