import DS from 'ember-data';
import { inject as service } from '@ember/service';

export default DS.Adapter.extend({
  strikersContracts: service(),

  queryRecord(store, type, query) {
    const contract = this.get('strikersContracts.StrikersPackSale.methods');
    if (query === 'standard') {
      return contract.standardSale().call();
    } else if (query === 'premium') {
      return contract.currentPremiumSale().call().then(sale => {
        return sale.id === '0' ? null : sale;
      });
    } else if (query === 'next') {
      return contract.nextPremiumSale().call().then(sale => {
        return sale.id === '0' ? null : sale;
      });
    }
  }
});
