import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

const WRONG_OWNER_ERROR = 'Hey! That cat is not yours.';

export default Route.extend({
  currentUser: service(),
  strikersContracts: service(),
  //buyPackWithKitty
  actions: {
    checkOwnership(kittyId) {
      if (isNaN(kittyId)) {
        this.set('controller.errorMessage', 'Kitty ID must be a number.');
        return;
      }

      const kittiesInterface = this.get('strikersContracts.KittiesInterface.methods');
      const myAddress = this.get('currentUser.address');
      kittiesInterface.ownerOf(kittyId).call()
      .then(owner => {
        if (owner !== myAddress) {
          throw new Error(WRONG_OWNER_ERROR);
        }

        this.set('controller.errorMessage', null);
        this.transitionTo('kitty-exchange.2', { queryParams: { kittyId }});
      })
      .catch(error => {
        if (error.message === WRONG_OWNER_ERROR) {
          this.set('controller.errorMessage', error.message);
        } else {
          this.set('controller.errorMessage', 'Kitty doesn\'t exist.');
        }
      });
    }
  },

  model() {
    const contract = this.get('strikersContracts.StrikersPackSale.methods');
    return contract.totalKittiesBurned().call();
  }
});
