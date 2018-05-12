import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import ENV from 'cryptostrikers/config/environment';

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

      const kittiesInterface = this.get('strikersContracts.KittiesInterface.methods');
      const myAddress = this.get('currentUser.user.id');
      kittiesInterface.ownerOf(kittyId).call()
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
      const kittiesInterface = this.get('strikersContracts.KittiesInterface.methods');
      const myAddress = this.get('currentUser.user.id');
      const packSaleAddress = ENV.strikers.saleContractAddress;
      kittiesInterface.approve(packSaleAddress, kittyId).send({ from: myAddress })
      .on('transactionHash', hash => {
        this.set('transactionHash', hash);
      });
    },

    getFreePack(kittyId) {
      const currentUser = this.get('currentUser');
      const packSaleContract = this.get('strikersContracts.StrikersPackSale.methods');
      const saleId = this.get('model.id');
      packSaleContract.buyPackWithKitty(saleId, kittyId).send({ from: currentUser.get('address') })
      .on('transactionHash', txnHash => {
        const type = 'buy_pack_with_kitty';
        const activity = { kittyId, saleId, txnHash, type };
        currentUser.addActivity(activity).then(activityId => {
          this.transitionToRoute('activity.show', activityId);
        });
      });
    }
  }
});
