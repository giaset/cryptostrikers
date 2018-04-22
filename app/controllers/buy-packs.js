import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import firebase from 'firebase';
import { computed } from '@ember/object';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),
  web3: service(),

  actions: {
    buyPackButtonClicked(saleId, qty) {
      this.set('selectedSale', saleId);
      this.set('selectedQuantity', qty);
    },

    buyPack(gasPrice) {
      const currentUser = this.get('currentUser.user');
      const saleContract = this.get('strikersContracts.StrikersPackSale.methods');
      const gasPriceInWei = this.get('web3').toWei(gasPrice.toString(), 'Gwei');
      const saleId = this.get('selectedSale');
      const packPrice = this.get('model.packPrice');
      const packQuantity = this.get('selectedQuantity');
      saleContract.buyPacksWithETH(saleId).send({
        from: currentUser.get('id'),
        /*gas: 750000,*/
        gasPrice: gasPriceInWei,
        value: packPrice * packQuantity
      })
      .on('transactionHash', hash => {
        this._handleTransactionHash(hash, currentUser);
      })
      .on('error', () => {
        // TODO: handle error
      });
    }
  },

  _handleTransactionHash(hash, currentUser) {
    const activity = this.store.createRecord('activity', {
      txnHash: hash,
      type: 'buy_pack',
      user: currentUser
    });
    currentUser.get('activities').addObject(activity);
    let activityId;
    activity.save().then(activity => {
      activityId = activity.get('id');
      // https://github.com/firebase/emberfire/issues/447#issuecomment-264001234
      activity.set('createdAt', firebase.database.ServerValue.TIMESTAMP);
      return activity.save();
    })
    .then(() => currentUser.save())
    .then(() => {
      this.transitionToRoute('activity.show', activityId);
    });
  },

  packPrice: computed('model.packPrice', function() {
    return this.get('web3').weiToEther(this.get('model.packPrice'));
  })
});
