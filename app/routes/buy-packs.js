import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  web3: service(),

  beforeModel() {
    if (this.get('web3.wrongNetwork')) {
      this.transitionTo('sign-in');
    }
  },

  model() {
    return this.get('store').findAll('sale').then(sales => {
      return sales.filter(sale => {
        const endTime = sale.get('endTime');
        if (!endTime) { return true; }
        const now = new Date().getTime();
        const diff = endTime.getTime() - now;
        return diff > 0;
      });
    });
  }
});
