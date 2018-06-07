import Component from '@ember/component';
import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';

export default Component.extend({
  classNames: ['trade-partner-row', 'row', 'text-center'],
  store: service(),
  web3: service(),

  counterpartyUser: computed('counterpartyAddress', 'counterpartyAddressError', function() {
    if (this.get('counterpartyAddressError')) { return null; }
    const address = this.get('counterpartyAddress');
    if (isBlank(address)) { return null; }
    if (!this.get('web3').isAddress(address)) { return null; }
    const promise = this.get('store').findRecord('user-metadata', address).catch(() => {
      return { nickname: 'unknown user' };
    });
    return DS.PromiseObject.create({ promise });
  }),
});
