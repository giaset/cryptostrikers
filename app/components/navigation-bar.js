import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  session: service(),
  classNames: ['navbar', 'navbar-expand-md', 'navbar-light'],
  tagName: 'header'
});
