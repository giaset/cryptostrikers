import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  currentUser: service(),
  metamaskWatcher: service(),
  session: service(),
  web3: service(),
  classNames: ['navbar', 'navbar-expand-md', 'navbar-light'],
  tagName: 'header',

  balance: computed('metamaskWatcher.currentBalance', function() {
    const weiBalance = this.get('metamaskWatcher.currentBalance');
    if (!weiBalance) {
      return null;
    }

    const ethBalance = this.get('web3').weiToEther(weiBalance);
    return parseFloat(ethBalance).toFixed(4);
  })
});
