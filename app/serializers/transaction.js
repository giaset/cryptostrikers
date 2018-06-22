import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
    const newPayload = { transactions: payload.result };
    newPayload.transactions.forEach(transaction => {
      transaction.id = transaction.hash;
      //console.log(transaction);
    });
    return this._super(store, primaryModelClass, newPayload, id, requestType);
  }
});
