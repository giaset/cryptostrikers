import Service from '@ember/service';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

export default Service.extend({
  web3: service(),

  loadAll() {
    const saleContractPromise = this._loadContract(
      'StrikersSale', '0x9414329bf6837db915b4d5e0e22ecc27a33129c5'
    );

    return saleContractPromise;
  },

  _loadContract(contractName, address) {
    const provider = this.get('web3').currentProvider();
    return $.getJSON(`http://localhost:4200/contracts/${contractName}.json`)
    .then(json => {
      let contract;
      run(() => {
        contract = TruffleContract(json);
        contract.setProvider(provider);
      });
      return contract.at(address);
    })
    .then(instance => {
      this.set(contractName, instance);
    });
  }
});
