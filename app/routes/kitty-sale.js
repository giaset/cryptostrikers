import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.get('store').findAll('sale').then(sales => {
      return sales.findBy('isKittySale');
    });
  }
});
