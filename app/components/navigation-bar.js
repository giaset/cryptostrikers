import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import ENV from 'cryptostrikers/config/environment';

export default Component.extend({
  currentUser: service(),
  metamaskWatcher: service(),
  session: service(),
  web3: service(),
  classNames: ['navbar', 'navbar-expand-sm', 'navbar-light'],
  tagName: 'header',
  showSignIn: !ENV.strikers.onlyShowLanding,

  balance: computed('metamaskWatcher.currentBalance', function() {
    const weiBalance = this.get('metamaskWatcher.currentBalance');
    const ethBalance = this.get('web3').weiToEther(weiBalance);
    return parseFloat(ethBalance).toFixed(4);
  })
});
