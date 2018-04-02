import Service from '@ember/service';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

export default Service.extend({
  web3: service(),

  loadAll(jsonPrefix) {
    const saleContractPromise = this._loadContract(
      'StrikersSale', '0x9414329bf6837db915b4d5e0e22ecc27a33129c5', jsonPrefix
    );

    return saleContractPromise;
  },

  _loadContract(contractName, address, jsonPrefix) {
    const web3 = this.get('web3');
    return $.getJSON(`${jsonPrefix}contracts/${contractName}.json`)
    .then(json => {
      run(() => {
        this.set(contractName, web3.contract(json.abi, address));
      });
    });
  }
});
