import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['email-capture-page'],
  intl: service(),

  actions: {
    toggleLocale() {
      const intl = this.get('intl');
      const currentLocale = intl.get('locale');
      const newLocale = currentLocale[0] === 'en-us' ? 'zh-Hans-CN' : 'en-us';
      intl.setLocale(newLocale);
    }
  }
});
