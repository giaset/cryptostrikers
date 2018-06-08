import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),

  actions: {
    claimBonusCard(bonusPlayerName) {
      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const currentUser = this.get('currentUser');
      const from = currentUser.get('address');
      contract.claimBonusCard().send({ from })
      .on('transactionHash', txnHash => {
        const type = 'claim_bonus_card';
        const activity = { bonusPlayerName, txnHash, type };
        currentUser.addActivity(activity).then(() => {
          this.transitionToRoute('activity.index');
        });
      });
    }
  }
});
