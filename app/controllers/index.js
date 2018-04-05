import Controller from '@ember/controller';
import ENV from 'cryptostrikers/config/environment';

export default Controller.extend({
  onlyShowLanding: ENV.strikers.onlyShowLanding
});
