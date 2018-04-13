import DS from 'ember-data';
import ENV from 'cryptostrikers/config/environment';

export default DS.RESTAdapter.extend({
  urlForQuery() {
    return ENV.strikers.openSeaApi;
  }
});
