import Service from '@ember/service';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import ENV from 'cryptostrikers/config/environment';
import RSVP from 'rsvp';

export default Service.extend({
  web3: service(),

  loadAll(jsonPrefix) {
    this.set('jsonPrefix', jsonPrefix);

    const checklistContractPromise = this._loadContract(
      'StrikersChecklist',
      ENV.strikers.checklistContractAddress
    );

    const coreContractPromise = this._loadContract(
      'StrikersCore',
      ENV.strikers.coreContractAddress
    );

    const kittiesContractPromise = this._loadContract(
      'KittiesInterface',
      ENV.strikers.kittiesContractAddress
    );

    const saleContractPromise = this._loadContract(
      'StrikersPackSale',
      ENV.strikers.saleContractAddress
    );

    return RSVP.all([
      checklistContractPromise,
      coreContractPromise,
      kittiesContractPromise,
      saleContractPromise
    ]);
  },

  _loadContract(contractName, address) {
    const jsonPrefix = this.get('jsonPrefix');
    const web3 = this.get('web3');
    return $.getJSON(`${jsonPrefix}contracts/${ENV.strikers.contractJsonPrefix}${contractName}.json`)
    .then(json => {
      run(() => {
        this.set(contractName, web3.contract(json.abi, address));
      });
    });
  }
});
