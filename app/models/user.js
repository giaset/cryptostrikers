import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default DS.Model.extend({
  web3: service(),

  account: DS.attr(),
  balance: DS.attr('string'),
  email: DS.attr('string'),
  username: DS.attr('string'),

  prettyBalance: computed('balance', function() {
    const balance = this.get('web3').weiToEther(this.get('balance'));
    return parseFloat(balance).toFixed(4);
  })
});
