import Service from '@ember/service';
import $ from 'jquery';
import { inject as service } from '@ember/service';

export default Service.extend({
  web3: service(),

  loadAll() {
    const web3 = this.get('web3');
    const saleContractPromise = $.getJSON('contracts/StrikersSale.json')
    .then(json => {
      this.saleContract = web3.contract(json.abi, '0x9414329bf6837db915b4d5e0e22ecc27a33129c5');
    });

    return saleContractPromise;
  }
});
