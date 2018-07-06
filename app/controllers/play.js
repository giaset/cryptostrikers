import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),

  actions: {
    submitClicked(gameId, card) {
      const contract = this.get('strikersContracts.StrikersUpdate.methods');
      const currentUser = this.get('currentUser');
      const from = currentUser.get('address');
      contract.makePick(gameId, card.get('id')).send({ from })
      .on('transactionHash', txnHash => {
        const type = 'make_pick';
        const gameNumber = parseInt(gameId) + 1;
        const activity = { gameNumber, submittedCard: card, txnHash, type };
        currentUser.addActivity(activity).then((() => {
          this.transitionToRoute('activity.index');
        }));
      });
    }
  }
});
