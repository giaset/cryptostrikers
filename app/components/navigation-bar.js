import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  intl: service(),
  session: service(),
  classNames: ['navigation-bar', 'navbar', 'navbar-expand-md', 'navbar-light'],
  tagName: 'nav',

  actions: {
    toggleLocale() {
      const intl = this.get('intl');
      const currentLocale = intl.get('locale');
      const newLocale = currentLocale[0] === 'en-us' ? 'zh-Hans-CN' : 'en-us';
      intl.setLocale(newLocale);
    }
  }
});
