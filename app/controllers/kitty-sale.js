import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import ENV from 'cryptostrikers/config/environment';
import firebase from 'firebase';

const WRONG_OWNER_ERROR = 'That cat is not yours.';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),
  actions: {
    checkOwnership(kittyId) {
      if (!kittyId) {
        this.set('errorMessage', 'Please enter a Kitty ID.');
        return;
      }

      if (isNaN(kittyId)) {
        this.set('errorMessage', 'Kitty ID must be an integer.');
        return;
      }

      const kittiesContract = this.get('strikersContracts.KittiesContract.methods');
      const myAddress = this.get('currentUser.user.id');
      kittiesContract.ownerOf(kittyId).call()
      .then(owner => {
        if (owner !== myAddress) {
          throw new Error(WRONG_OWNER_ERROR);
        }

        this.set('verifiedKittyId', kittyId);
        this.set('errorMessage', null);
        // FUCK: kitties contract doesn't support this yet
        /*return kittiesContract.getApproved(kittyId).call();
      })
      .then(approvedAddress => {
        console.log(approvedAddress);*/
      })
      .catch(error => {
        if (error.message === WRONG_OWNER_ERROR) {
          this.set('errorMessage', error.message);
        } else {
          this.set('errorMessage', 'Kitty doesn\'t exist.');
        }
      });
    },

    approveKitty(kittyId) {
      const kittiesContract = this.get('strikersContracts.KittiesContract.methods');
      const myAddress = this.get('currentUser.user.id');
      const packSaleAddress = ENV.strikers.saleContractAddress;
      kittiesContract.approve(packSaleAddress, kittyId).send({ from: myAddress })
      .on('transactionHash', hash => {
        this.set('transactionHash', hash);
      });
    },

    getFreePack(kittyId) {
      const currentUser = this.get('currentUser.user');
      const packSaleContract = this.get('strikersContracts.StrikersPackSale.methods');
      const saleId = this.get('model.id');
      packSaleContract.buyPackWithKitty(saleId, kittyId).send({ from: currentUser.get('id') })
      .on('transactionHash', hash => {
        this._handleTransactionHash(hash, currentUser, saleId, kittyId);
      });
    }
  },

  // TODO: put this in a service or something
  _handleTransactionHash(hash, currentUser, saleId, kittyId) {
    const activity = this.store.createRecord('activity', {
      kittyId: kittyId,
      saleId: saleId,
      txnHash: hash,
      type: 'buy_pack_with_kitty',
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
  }
});
