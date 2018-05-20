import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),
  web3: service(),

  checklistItem: alias('model.checklistItem'),
  myCards: alias('model.myCards'),

  actions: {
    sellClicked(card, price) {
      console.log(`Selling card #${card.get('id')} for ${price} ETH.`);
      /*const contract = this.get('strikersContracts.StrikersCore.methods');
      const priceInWei = this.get('web3').toWei(price.toString());
      contract.listCardForSale(card.get('id'), priceInWei).send({
        from: this.get('currentUser.user.id')
      });*/
    }
  }
});
