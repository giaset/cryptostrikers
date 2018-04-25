import DS from 'ember-data';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default DS.Adapter.extend({
  strikersContracts: service(),

  findAll() {
    const contract = this.get('strikersContracts.StrikersPackSale.methods');
    return contract.salesCount().call().then(salesCount => {
      const promises = [];
      for (let i = 0; i < salesCount; i++) {
        promises.push(contract.sales(i).call());
      }
      return RSVP.all(promises);
    })
    .then(sales => {
      sales.forEach((sale, index) => {
        sale.id = index;
        // Ember uses milliseconds while Solidity uses seconds...
        sale.duration = sale.duration * 1000;
        sale.startTime = sale.startTime * 1000;
      });
      return { sales };
    });
  }
});
