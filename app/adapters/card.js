import DS from 'ember-data';
import ENV from 'cryptostrikers/config/environment';
import { inject as service } from '@ember/service';

export default DS.RESTAdapter.extend({
  strikersContracts: service(),

  findRecord(store, type, id) {
    const contract = this.get('strikersContracts.StrikersMinting.methods');
    return contract.cards(id).call();
  },

  urlForQuery() {
    return ENV.strikers.openSeaApi;
  }
});
