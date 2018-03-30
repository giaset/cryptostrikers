import Service from '@ember/service';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

export default Service.extend({
  web3: service(),

  loadAll() {
    const saleContractPromise = this._loadContract(
      'StrikersSale', '0x0CA7B877Fe199f907736cb9B32511c94B50Db973'
    );

    return saleContractPromise;
  },

  _loadContract(contractName, address) {
    const provider = this.get('web3').currentProvider();
    return $.getJSON(`http://staging.cryptostrikers.com/contracts/${contractName}.json`)
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
