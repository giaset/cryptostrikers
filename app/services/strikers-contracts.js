import Service from '@ember/service';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import ENV from 'cryptostrikers/config/environment';

export default Service.extend({
  web3: service(),

  loadAll(jsonPrefix) {
    const saleContractPromise = this._loadContract(
      'StrikersSale', ENV.strikers.saleContractAddress, jsonPrefix
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
  },

  getCardIdsFromPackBoughtReceipt(receipt) {
    // TODO: maybe there's a way to get this straight from the JSON
    const topic = '0x1947a407fc738aebf73559f82e681274d64efa878ea80c083c5c081d4e9833a0';
    const inputs = [
      {
        indexed: true,
        name: 'buyer',
        type: 'address'
      },
      {
        indexed: false,
        name: 'pack',
        type: 'uint256[]'
      }
    ];

    let cardIds = [];
    receipt.logs.forEach(log => {
      if (log.topics[0] !== topic) {
        return;
      }

      const decoded = this.get('web3').decodeLog(inputs, log.data, log.topics.slice(1));
      cardIds = cardIds.concat(decoded.pack);
    });

    return cardIds;
  }
});
