import AjaxService from 'ember-ajax/services/ajax';

export default AjaxService.extend({
  // TODO: support https://us-central1-cryptostrikers-prod.cloudfunctions.net/sign
  host: 'https://us-central1-cryptostrikers-api.cloudfunctions.net'
});
