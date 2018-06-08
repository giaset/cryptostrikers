import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  web3: service(),

  actions: {
    createTrade(trade) {
      const currentUser = this.get('currentUser');
      const address = currentUser.get('address');
      this.get('web3').personalSign(trade.hash, address).then(signedHash => {
        trade.signedHash = signedHash;
        const newTrade = this.get('store').createRecord('trade', trade);
        return newTrade.save();
      })
      .then(trade => {
        const tradeString = trade.get('prettyString');
        const type = 'create_trade';
        const activity = { trade, tradeString, type };
        return currentUser.addActivity(activity);
      })
      .then(() => {
        this.transitionToRoute('activity.index');
      });
    }
  }
});
