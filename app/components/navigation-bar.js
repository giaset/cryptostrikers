import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  session: service(),
  classNames: ['navigation-bar', 'navbar', 'navbar-expand-md', 'navbar-light'],
  tagName: 'nav'
});
