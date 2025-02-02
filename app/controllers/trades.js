import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),
  web3: service(),
  trade: alias('model.trade'),

  actions: {
    acceptTrade(submittedCardId) {
      const currentUser = this.get('currentUser');
      const contract = this.get('strikersContracts.StrikersCore.methods');
      const trade = this.get('trade');
      const maker = trade.get('maker');
      const makerCardId = trade.get('makerCard.id');
      const taker = trade.get('taker');
      const takerCardOrChecklistId = trade.get('takerCardOrChecklistId');
      const salt = trade.get('salt');
      const sigParams = this._signatureToParams(trade.get('signedHash'));
      contract.fillTrade(
        maker,
        makerCardId,
        taker,
        takerCardOrChecklistId,
        salt,
        submittedCardId,
        sigParams.v,
        sigParams.r,
        sigParams.s
      ).send({ from: currentUser.get('address') })
      .on('transactionHash', txnHash => {
        const tradeString = trade.get('prettyString');
        const type = 'fill_trade';
        const activity = { trade, tradeString, txnHash, type };
        currentUser.addActivity(activity).then(() => {
          this.transitionToRoute('activity.index');
        });
      });
    },

    cancelTrade(trade) {
      const currentUser = this.get('currentUser');
      const contract = this.get('strikersContracts.StrikersCore.methods');
      const maker = trade.get('maker');
      const makerCardId = trade.get('makerCard.id');
      const taker = trade.get('taker');
      const takerCardOrChecklistId = trade.get('takerCardOrChecklistId');
      const salt = trade.get('salt');
      contract.cancelTrade(
        maker,
        makerCardId,
        taker,
        takerCardOrChecklistId,
        salt
      ).send({ from: currentUser.get('address') })
      .on('transactionHash', txnHash => {
        const tradeString = trade.get('prettyString');
        const type = 'cancel_trade';
        const activity = { trade, tradeString, txnHash, type };
        currentUser.addActivity(activity).then(() => {
          this.transitionToRoute('activity.index');
        });
      });
    }
  },

  _signatureToParams(signature) {
    const r = signature.slice(0, 66);
    const s = '0x' + signature.slice(66, 130);
    const vHex = '0x' + signature.slice(130, 132);
    const v = this.get('web3').hexToNumber(vHex);
    return { r, s, v };
  }
});
