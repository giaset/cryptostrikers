import AjaxService from 'ember-ajax/services/ajax';
import ENV from 'cryptostrikers/config/environment';

export default AjaxService.extend({
  host: ENV.strikers.apiHost
});
