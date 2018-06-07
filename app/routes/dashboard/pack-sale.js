import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentUser: service(),
  strikersContracts: service(),
  web3: service(),
  actions: {
    withdrawBalance() {
      const from = this.get('currentUser.address');
      this.get('strikersContracts.StrikersPackSale.methods').withdrawBalance().send({ from });
    }
  },

  model() {
    const contract = this.get('strikersContracts.StrikersPackSale');
    const web3 = this.get('web3');
    const contractBalance = web3.getBalance(contract._address).then(weiBalance => web3.weiToEther(weiBalance));
    const totalCommissionOwed = contract.methods.totalCommissionOwed().call().then(weiCommission => web3.weiToEther(weiCommission));
    const totalEthRaised = contract.methods.totalWeiRaised().call().then(weiRaised => web3.weiToEther(weiRaised));

    return RSVP.hash({
      contractBalance,
      totalCommissionOwed,
      totalEthRaised
    });
  }
});
