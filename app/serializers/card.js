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
    const card = payload;
    card.id = id;
    return this._super(store, primaryModelClass, { card }, id, requestType);
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
    } else if (hash[0]) { // massage data coming from smart contract
      fixedHash = {
        id: hash.id,
        checklistItem: hash.checklistId.padStart(3, '0'),
        mintTime: hash.mintTime * 1000,
        sale: hash.sale,
        serialNumber: hash.serialNumber
      };
    }

    return this._super(typeClass, fixedHash);
  }
});
