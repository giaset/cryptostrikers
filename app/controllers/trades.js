import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),
  web3: service(),
  trade: alias('model'),

  actions: {
    acceptTrade(submittedCardId) {
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
      ).send({ from: this.get('currentUser.address') });
    },

    cancelTrade(trade) {
      console.log(trade.get('id'));
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
