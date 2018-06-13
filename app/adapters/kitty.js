import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  urlForFindRecord(id) {
    return `https://api.cryptokitties.co/kitties/${id}`;
  }
});
