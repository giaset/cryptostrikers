import ModalComponent from 'ember-modal-service/components/modal';
import { inject as service } from '@ember/service';

const WRONG_OWNER_ERROR = 'This is not your cat.';

export default ModalComponent.extend({
  classNames: ['modal-kitty'],
  currentUser: service(),
  strikersContracts: service(),
  actions: {
    clickedOverlay() {
      this.reject();
    },

    submitKitty() {
      const kittyId = this.get('kittyId');
      if (!kittyId) {
        this.set('errorMessage', 'Please enter a Kitty ID.');
        return;
      }

      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const myAddress = this.get('currentUser.user.id');
      contract.ownerOfKitty(kittyId).call()
      .then(owner => {
        if (owner !== myAddress) {
          throw new Error(WRONG_OWNER_ERROR);
        }

        const saleId = this.get('model.options.saleId');
        return contract.buyPackWithKitty(saleId, kittyId).send({ from: myAddress });
        /*.on('transactionHash', hash => {
          debugger;
        });*/
      })
      .catch(error => {
        if (error.message === WRONG_OWNER_ERROR) {
          this.set('errorMessage', error.message);
        } else {
          this.set('errorMessage', 'Kitty doesn\'t exist.');
        }
      });
    }
  }
});
