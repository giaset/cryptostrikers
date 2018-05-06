import DS from 'ember-data';
import { inject as service } from '@ember/service';

export default DS.RESTSerializer.extend({
  worldCupInfo: service(),

  modelNameFromPayloadKey(key) {
    if (key === 'assets') {
      return this._super('cards');
    }
    return this._super(key);
  },

  normalizeFindRecordResponse(store, primaryModelClass, payload, id, requestType) {
    const fixedPayload = { card: payload };
    fixedPayload.card.id = id;
    fixedPayload.card.checklistItem = payload.checklistId.padStart(3, '0');
    fixedPayload.card.mintTime = parseInt(payload.mintTime) * 1000;
    fixedPayload.card.sale = payload.saleId;
    return this._super(store, primaryModelClass, fixedPayload, id, requestType);
  },

  normalizeQueryResponse(store, primaryModelClass, payload) {
    delete payload.count;
    return this._super(...arguments);
  },

  normalize(typeClass, hash) {
    let fixedHash = hash;

    // Massage the data coming from OpenSea
    if (hash.token_id) {
      const playerName = hash.traits.filterBy('trait_type', 'player')[0].value;
      const playerId = this.get('worldCupInfo.nameToId')[playerName];
      fixedHash = {
        id: hash.token_id,
        player: playerId
      };
    }

    return this._super(typeClass, fixedHash);
  }
});
