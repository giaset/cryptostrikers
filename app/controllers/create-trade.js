import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  web3: service(),

  actions: {
    createTrade(trade) {
      const currentUser = this.get('currentUser');
      const address = currentUser.get('address');
      let tradeString;
      this.get('web3').personalSign(trade.hash, address).then(signedHash => {
        trade.signedHash = signedHash;
        const newTrade = this.get('store').createRecord('trade', trade);
        tradeString = newTrade.get('prettyString');
        return newTrade.save();
      })
      .then(trade => {
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
