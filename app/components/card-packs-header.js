import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['card-packs-header', 'row', 'text-center', 'py-5'],

  alertText: computed('standardWhitelistAllocation', 'premiumWhitelistAllocation', function() {
    let str = '';

    const standardWhitelistAllocation = parseInt(this.get('standardWhitelistAllocation'));
    if (standardWhitelistAllocation > 0) {
      str += `${standardWhitelistAllocation} Standard Pack`;
    }
    if (standardWhitelistAllocation > 1) {
      str += 's';
    }

    const premiumWhitelistAllocation = parseInt(this.get('premiumWhitelistAllocation'));
    if (premiumWhitelistAllocation > 0) {
      str = str.length > 0 ? `${str} and ` : str;
      str += `${premiumWhitelistAllocation} Premium Pack`;
    }
    if (premiumWhitelistAllocation > 1) {
      str += 's';
    }

    return str;
  }),

  shouldShowAlert: computed('standardWhitelistAllocation', 'premiumWhitelistAllocation', function() {
    const hasStandardWhitelistAllocation = this.get('standardWhitelistAllocation') > 0;
    const hasPremiumWhitelistAllocation = this.get('premiumWhitelistAllocation') > 0;
    return hasStandardWhitelistAllocation || hasPremiumWhitelistAllocation;
  })
});
