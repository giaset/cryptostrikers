import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  strikersContracts: service(),

  beforeModel() {
    return this.get('store').findAll('checklist-item');
  },

  model(params) {
    const contract = this.get('strikersContracts.StrikersPackSale');
    const filter = { saleId: params.sale_id };
    return contract.getPastEvents('PacksLoaded', { filter, fromBlock: 0, toBlock: 'latest' }).then(events => {
      const countForChecklistId = {};
      events.forEach(event => {
        event.returnValues.packs.forEach(pack => {
          const checklistIds = this._packToChecklistIds(parseInt(pack));
          checklistIds.forEach(checklistId => {
            const paddedChecklistId = checklistId.toString().padStart(3, '0');
            if (countForChecklistId[paddedChecklistId]) {
              countForChecklistId[paddedChecklistId]++;
            } else {
              countForChecklistId[paddedChecklistId] = 1;
            }
          });
        });
      });

      return Object.keys(countForChecklistId).sort().map(key => {
        return {
          checklistItem: this.get('store').peekRecord('checklist-item', key),
          count: countForChecklistId[key]
        };
      });
    });
  },

  _packToChecklistIds(pack) {
    const checklistId1 = pack >> 24;
    const checklistId2 = (pack >> 16) & 255;
    const checklistId3 = (pack >> 8) & 255;
    const checklistId4 = pack & 255;

    return [checklistId1, checklistId2, checklistId3, checklistId4];
  }
});
