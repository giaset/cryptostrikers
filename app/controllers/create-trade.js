import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  web3: service(),

  actions: {
    createTrade(trade, tradeHash) {
      const currentUser = this.get('currentUser');
      const address = currentUser.get('address');
      this.get('web3').personalSign(tradeHash, address).then(signedHash => {
        trade.signedHash = signedHash;
        const newTrade = this.get('store').createRecord('trade', trade);
        return newTrade.save();
      })
      .then(trade => {
        const type = 'create_trade';
        const activity = { trade, type };
        return currentUser.addActivity(activity);
      })
      .then(() => {
        this.transitionToRoute('activity.index');
      });
    }
  }
});
