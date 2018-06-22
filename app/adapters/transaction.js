import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  urlForQuery() {
    return 'http://api.etherscan.io/api?module=account&action=txlist';
  }
});
